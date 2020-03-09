const fs = require('fs')
const jwt = require('jsonwebtoken')

// use 'utf8' to get string instead of byte array  (512 bit key)

const privateKEY = fs.readFileSync('./ssl/prod/server.key', 'utf8')
const publicKEY = fs.readFileSync('./ssl/prod/server.cert', 'utf8')

module.exports = {
  sign: (payload, options) => {
    const signatureOptions = jwtOptions(options)
    return jwt.sign(payload, privateKEY, signatureOptions)
  },
  verify: (token, options) => {
    const verifyOptions = jwtOptions(options)
    try { return jwt.verify(token, publicKEY, verifyOptions) }
    catch (err) { return false }
  },
  // don't use this, it doesn't check signature
  decode: (token) => {
    return jwt.decode(token, { complete: true }) // null if invalid
  },
  jwtOptions
}

function jwtOptions (options) {
  let { issuer, subject, audience } = options
  issuer = issuer || 'PalmettoPark'
  audience = audience || 'client'
  const expiresIn = '30d'
  const algorithm = 'RS256'
  return { issuer, subject, audience, expiresIn, algorithm }
}