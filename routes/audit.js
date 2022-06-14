const router = require('koa-router')()

const asyncForEach = require('../utils/asyncForEach')

const {
  User,
  Ticket,
  Audit
} = require('../models')

module.exports = ({ psql, knex }) => {
  User.knex(psql)
  Ticket.knex(psql)
  Audit.knex(psql)

  router.post('/audit', postAudit)
  router.get('/audit', getAudit)


  async function getAudit (ctx, next) {
    ctx.body = await Audit.query().withGraphFetched('[ticket,to,from]').orderBy('created_at', 'desc');
  }

  async function postAudit (ctx, next) {

  }

  return router
}
