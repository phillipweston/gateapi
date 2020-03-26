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
  router.post('/tickets/transfer', transferTickets)

  async function getUsers (ctx, next) {
    ctx.body = await User.query().eager({ tickets: true })
  }

  async function getUser (ctx, next) {
    ctx.body = await User.query().where({ user_id: ctx.params.id }).eager({ tickets: true }).first()
  }

  async function getTickets (ctx, next) {
    ctx.body = await Ticket.query().eager('[owner]')
  }

  async function transferTickets (ctx, next) {
    console.log('body', ctx.request.body)

    const { records } = ctx.request.body

    const updatedTickets = []

    await User.transaction(async trx => {
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
      for await (let { name, ticket_id } of records) {
        name = name.trim()
        const fetched = await User.query(trx).where({ name })
        const owner = fetched && fetched.length && fetched[0]

        console.log('owner', owner)
        await Ticket.query(trx).update({ user_id: owner.user_id, updated_at: new Date().toISOString() }).where({ ticket_id })
        const ticketRow = await Ticket.query(trx).where({ ticket_id })
        if (ticketRow && ticketRow.length) updatedTickets.push(ticketRow[0])
      }
    })
    console.log('updatedTickets', updatedTickets)
    ctx.body = updatedTickets
  }

  return router
}
