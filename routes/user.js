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
    ctx.body = await User.query().where({ user_id: ctx.params.id }).eager({ tickets: true })
  }

  async function getTickets (ctx, next) {
    ctx.body = await Ticket.query().eager('[owner]')
  }

  async function transferTickets (ctx, next) {
    const { transfers } = ctx.request.body
    let updatedTickets = []
    console.log("transfers", transfers)

    await User.transaction(async trx => {
      for await (let { name } of transfers) {
        name = name.trim()
        console.log("name", name)
        let fetched = await User.query(trx).where({ name })
        if (fetched.length === 0) {
          fetched = await User.query(trx).insert({ name })
        }
      }
    })

    await Ticket.transaction(async trx => {
      // asyncForEach(transfers, async (let { name, ticket_id }))
      for await (let { name, ticket_id } of transfers) {
        name = name.trim()
        let fetched = await User.query(trx).where({ name })
        let owner = fetched && fetched.length && fetched[0]

        console.log('owner', owner)
        await Ticket.query(trx).update({ user_id: owner.user_id, updated_at: new Date().toISOString() }).where({ ticket_id })
        const ticket = await Ticket.query(trx).where({ ticket_id: ticket_id })
        if (ticket && ticket.length) updatedTickets.push(ticket[0])
      }
    })
    console.log("results", updatedTickets)
    ctx.body = updatedTickets
  }

  return router
}
