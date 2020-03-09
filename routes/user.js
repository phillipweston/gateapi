const router = require('koa-router')()

const {
  Property
} = require('../models')

module.exports = ({ psql }) => {
  Property.knex(psql)
  router.get('/users', listUsers)

  async function listUsers (ctx, next) {
    ctx.body = await Property.query().eager('[type, status]').limit(10)
  }

}
