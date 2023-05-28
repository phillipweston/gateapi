// IMPORTS
//
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const formidable = require('koa2-formidable')
const errorCatcher = require('./middlewares/error-catcher')
const knex = require('knex')
const { PG_READ_URL, PG_WRITE_URL, PORT } = require('./config')
const KoaStatic = require('koa-static')


// INSTANTIATE APPLICATION
//
const app = new Koa()
const router = new Router()

// STANDARD MIDDLEWARES FOR SECURITY, ETC
//
app.use(logger()) // help us with logging
// app.use(helmet()) // apply extra security to not allow webserver to identify anything about itself, not allow xss, etc
app.use(KoaStatic('uploads'))

app.use(formidable())
app.use(bodyParser({
  multipart: true,
  extendTypes: {
    json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
  }
}))
// app.use(bearerToken()) // add ctx.request.token with the jwt
// app.use(userAgent)
app.use(cors({
  origin: '*',
  // origin: process.env.NODE_ENV === 'production' ? 'https://www.palmettopark.com' : 'http://localhost:3000',
  credentials: true
}))

// DATABASE CONNECTIONS
//
const psql = knex({
  client: 'pg',
  connection: PG_WRITE_URL
})

// INSTANTIATE ROUTERS WITH DATABASE CONNECTIONS
//
app.use(require('./routes/health')({ psql }).routes())
app.use(require('./routes/user')({ psql, knex }).routes())
app.use(require('./routes/tickets')({ psql, knex }).routes())
app.use(require('./routes/audit')({ psql, knex }).routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.use(errorCatcher)

app.listen(PORT)

module.exports = app
