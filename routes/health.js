const router = require('koa-router')()

module.exports = ({ psql }) => {

  router.get('/health', healthCheck)

  async function healthCheck (ctx, next) {
    // check that datastore connections are successful
    const success = psql // && pgWrite // DOES NOTHING, WRITE LOGIC TO ACTUALLY VERIFY DS HEALTH
    ctx.body = { success }
    ctx.status = success ? 200 : 500
  }

  return router
}
