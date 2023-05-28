const router = require('koa-router')()
const fs = require('fs')

const asyncForEach = require('../utils/asyncForEach')

const {
  User,
  Ticket,
  Audit
} = require('../models')

module.exports = ({ psql, knex }) => {
  User.knex(psql)
  Ticket.knex(psql)

  router.get('/tickets', getTickets)
  router.post('/tickets/transfer', transferTickets)
  router.get('/tickets/:id', getTicket)
  router.get('/tickets/redeem/:id', toggleRedeem)
  router.post('/tickets', createTicket)
  router.post('/tickets/upload/:id', uploadPhoto)

  async function uploadPhoto (ctx, next) {
    const { id } = ctx.params
    const file = ctx.request.files.files
    const filePath = 'uploads/' + `${id}.png`
    const fileContent = fs.readFileSync(file.path);
    fs.writeFileSync(filePath, fileContent);
    ctx.body = { success: true }
  }

  async function createTicket (ctx, next) {
    const { name, email, phone } = ctx.request.body
    const user = await User.query().insert({ name, email, phone })
    await Ticket.query().insert({ user_id: user.user_id, original_owner_id: user.user_id })
    await Audit.query().insert({
      action: 'create',
      to_id: user.user_id,
      from_id: user.user_id
    })
    ctx.body = user
  }

  async function getTicket (ctx, next) {
    ctx.body = await Ticket.query().withGraphFetched('[owner, originalOwner]').where({ ticket_id: ctx.params.id })
  }

  async function getTickets (ctx, next) {
    ctx.body = await Ticket.query().withGraphFetched('[owner, originalOwner]')
  }
 
  async function toggleRedeem (ctx, next) {
    const { id: ticket_id } = ctx.params
    try {
        let ticket = await Ticket.query().where({ ticket_id }).first()
        await ticket.$query().updateAndFetch({
            redeemed: !ticket.redeemed,
            updated_at: new Date().toISOString() })
            .where({ ticket_id })
        await Audit.query().insert({
            action: 'redeem',
            ticket_id: ticket.ticket_id,
            to_id: ticket.user_id,
            from_id: ticket.user_id
        })
        ctx.body = ticket
    }
    catch (error) {
        ctx.status = 500
        ctx.body = error
    }
  }

  async function transferTickets (ctx, next) {
    // return ctx.body = ctx.request.bmody

    console.log('body', ctx.request.body)

    const { records } = ctx.request.body

    const updatedTickets = []

    await User.transaction(async trx => {
      console.log('in user transaction')
      for await (let { name } of records) {
        name = name.trim()
        console.log('name', name)
        let fetched = await User.query(trx).where({ name })
        if (fetched.length === 0) {
          fetched = await User.query(trx).insert({ name })
        }
      }
    })

    await Ticket.transaction(async trx => {
      // asyncForEach(transfers, async (let { name, ticket_id }))
      console.log('in ticket transaction', records)
      for await (let { name, ticket_id } of records) {
        name = name.trim()
        const fetched = await User.query(trx).where({ name })
        const owner = fetched && fetched.length && fetched[0]
        const ticket = await Ticket.query(trx).withGraphFetched('[owner]').where({ ticket_id })
        await Ticket.query(trx).update({ user_id: owner.user_id, updated_at: new Date().toISOString() }).where({ ticket_id })
        const ticketRow = await Ticket.query(trx).where({ ticket_id }).withGraphFetched('[owner]')

        await Audit.query(trx).insert({
            action: 'transfer',
            ticket_id,
            to_id: owner.user_id,
            from_id: ticket[0].user_id
        })

        if (ticketRow && ticketRow.length) updatedTickets.push(ticketRow[0])
      }
    })
    console.log('updatedTickets', updatedTickets)
    ctx.body = updatedTickets
  }

  return router
}
