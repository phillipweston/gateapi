const router = require('koa-router')()

const asyncForEach = require('../utils/asyncForEach')

const {
  User,
  Ticket
} = require('../models')

module.exports = ({ psql, knex }) => {
  User.knex(psql)
  Ticket.knex(psql)

  router.get('/users', getUsers)
  router.get('/users/:id', getUser)
  router.get('/tickets', getTickets)
  router.post('/tickets/trasfer', transferTickets)
  router.get('/tickets/:id', getTicket)
  router.post('/audit', postAuditLog)
  router.get('/audit', getAuditLog)

  router.get('/tickets/redeem/:id', toggleRedeem)


  async function toggleRedeem (ctx, next) {
    const { id: ticket_id } = ctx.params
    return Ticket.transaction(async trx =>
      Ticket.query(trx).updateAndFetch({
        redeemed: !ticket.redeemed,
        updated_at: new Date().toISOString() })
      .where({ ticket_id }))
  }

  async function postAuditLog (ctx, next) {
  }
  async function getAuditLog (ctx, next) {
  }

  async function getTicket (ctx, next) {
    ctx.body = await Ticket.query().withGraphFetched('[owner]').where({ ticket_id: ctx.params.id })
  }

  async function getUsers (ctx, next) {
    ctx.body = await User.query().withGraphFetched('[tickets]');
  }

  async function getUser (ctx, next) {
    ctx.body = await User.query().where({ user_id: ctx.params.id }).withGraphFetched('[tickets]').first();
  }

  async function getTickets (ctx, next) {
    ctx.body = await Ticket.query().withGraphFetched('[owner]')
  }
 
  async function transferTickets (ctx, next) {
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

        console.log('owner', owner)
        await Ticket.query(trx).update({ user_id: owner.user_id, updated_at: new Date().toISOString() }).where({ ticket_id })
        const ticketRow = await Ticket.query(trx).where({ ticket_id }).withGraphFetched('[owner]')
        if (ticketRow && ticketRow.length) updatedTickets.push(ticketRow[0])
      }
    })
    console.log('updatedTickets', updatedTickets)
    ctx.body = updatedTickets
  }

  return router
}
