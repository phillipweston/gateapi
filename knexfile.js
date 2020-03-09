
const { PG_WRITE_URL } = require('./config')

module.exports = {
  development: {
    client: 'pg',
    connection: PG_WRITE_URL,
    seeds: {
      directory: './seeds'
    }
  }
}
