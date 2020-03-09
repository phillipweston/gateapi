const router = require('koa-router')()

const {
  User,
  Ticket
} = require('../models')

module.exports = ({ psql }) => {
  User.knex(psql)
  Ticket.knex(psql)

  router.get('/users', listUsers)
  router.get('/tickets', listTickets)

  async function listUsers (ctx, next) {
    ctx.body = await User.query().eager({ tickets: true })
  }
  async function listTickets (ctx, next) {
    ctx.body = await Ticket.query().eager('[owner]')
  }

  return router
}
