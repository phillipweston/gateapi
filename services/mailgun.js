var Mailgun = require('mailgun-js')

const {
  MAILGUN_PRIV,
  MAILGUN_DOMAIN
} = require('../config')

module.exports = new Mailgun({
  apiKey: MAILGUN_PRIV,
  domain: MAILGUN_DOMAIN
})
