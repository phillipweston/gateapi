const {
  User,
  Ticket
} = require('../models')

const connection = require('../knexfile')
const Knex = require('knex')
const psql = Knex(connection.development)
const fs = require('fs')
const { parse } = require('csv')

// need to account for early arrival and possibly late departure

exports.seed = async (knex, Promise) => {
  User.knex(psql)
  Ticket.knex(psql)

  const parser = fs.createReadStream('./seeds/tickets.csv').pipe(parse({ columns: true }))

  await knex('users').del()
  await knex('tickets').del()

  process.stdout.write('starting seed of guests and their tickets\n')

  for await (const record of parser) {
    const { name, email, adults } = record

    let user = { name, email }
    let tickets = []

    user = await User.query().where('email', '=', email)[0] || await User.query().insert(user)

    console.log('user', user)

    for (let i = 1; i <= Number(adults); i++) {
      // make a ticket reference so we can trade this exact ticket to someone else
      tickets.push(Ticket.query().insert({
        user_id: user.user_id
      }))
    }
    await Promise.all(tickets)
  }
  return Promise.resolve()
}
