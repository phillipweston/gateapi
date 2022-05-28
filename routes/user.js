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


  async function getUsers (ctx, next) {
    ctx.body = await User.query().withGraphFetched('[tickets]');
  }

  async function getUser (ctx, next) {
    ctx.body = await User.query().where({ user_id: ctx.params.id }).withGraphFetched('[tickets]').first();
  }

  return router
}
