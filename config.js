'use strict'

require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 7777,
  PG_READ_URL: process.env.PG_READ_URL,
  PG_WRITE_URL: process.env.PG_WRITE_URL || 'postgres://gate:gate@127.0.0.1:5432/gate',
  PG_LOCALHOST: process.env.PG_LOCALHOST,
  MAILGUN_PUB: process.env.MAILGUN_PUB,
  MAILGUN_PRIV: process.env.MAILGUN_PRIV,
  MAILGUN_DOMAIN: '',
  MAILGUN_FROM: '31337@h4x0r.g0v'
}
