const router = require('koa-router')()

const asyncForEach = require('../utils/asyncForEach')

const {
  User,
  Ticket
} = require('../models')

module.exports = ({ psql, knex }) => {
  User.knex(psql)
  Ticket.knex(psql)

  router.post('/audit', postAuditLog)
  router.get('/audit', getAuditLog)

  async function postAuditLog (ctx, next) {
  }
  async function getAuditLog (ctx, next) {
  }

  return router
}
