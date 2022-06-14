const { User, Ticket, Audit } = require('../models')

const connection = require('../knexfile')
const Knex = require('knex')
const psql = Knex(connection.development)
const fs = require('fs')
const { parse } = require('csv')
const user = require('../routes/user')

// need to account for early arrival and possibly late departure

exports.seed = async (knex) => {
    User.knex(psql)
    Ticket.knex(psql)
    Audit.knex(psql)

    const parser = fs
        .createReadStream('./seeds/tickets.csv')
        .pipe(parse({ columns: true }))

    await knex('audit_log').del()
    await knex('users_tickets').del()
    await knex('tickets').del()
    await knex('users').del()

    process.stdout.write('starting seed of guests and their tickets\n')

    for await (const record of parser) {
        const { name, email, adults, status, guests } = record

        let user = { name: name.trim(), email: email.trim() }
        let tickets = []

        if (['A', 'C', 'P'].includes(status)) {
            user =
                (await User.query().findOne('name', '=', name)) ||
                (await User.query().insert(user))

            console.log('user', user)

            for (let i = 1; i <= Number(adults); i++) {
                // make a ticket reference so we can trade this exact ticket to someone else
                tickets.push(
                    Ticket.query().insert({
                        user_id: user.user_id,
                    })
                )
            }
        }

        await Promise.all(tickets)

        if (['A', 'C', 'P'].includes(status)) {
            const _guests = guests
                .replace('[', '')
                .replace(']', '')
                .replace(/"/g, '')
                .split(',')

            for await (const _guest of _guests) {
                const names = _guest
                    .trim()
                    .split(' ')
                    .filter((n) => n != '')
                let valid = true
                if (names.length < 2) valid = false // TBD, first name only, empty array, etc
                if (
                    names[names.length - 1] &&
                    names[names.length - 1].length < 2
                )
                    valid = false
                if (names.length > 4) valid = false
                if (_guest.includes('(') || _guest.includes(')')) valid = true
                const guestName = names.join(' ')

                if (valid) {
                    if (guestName === 'Rick Fletcher') debugger
                    let guest = await User.query().findOne(
                        'name',
                        '=',
                        guestName.trim()
                    )

                    if (!guest) {
                        guest = await User.query().insert({
                            name: guestName.trim(),
                            email,
                        })
                    }

                    console.log('guest', guest, name)

                    user = await User.query()
                        .findOne('name', '=', name)
                        .withGraphFetched('[tickets]')

                    // if (email === 'djethan@mac.com') debugger

                    const lastTicket = user.tickets[user.tickets.length - 1]

                    if (lastTicket) {
                        await Ticket.query()
                            .update({ user_id: guest.user_id })
                            .where({ ticket_id: lastTicket.ticket_id })

                        await Audit.query().insert({
                            action: 'transfer',
                            ticket_id: lastTicket.ticket_id,
                            to_id: guest.user_id,
                            from_id: user.user_id,
                        })

                        console.log('user', user, email)
                        console.log('lastTicket', lastTicket)
                    }
                }
            }
        }
    }
    // parse each line again
    // find each existing user and all of their tickets
    // parse through the string[] and find or create new users for each person
    // assign them their ticket
    // update the audit log

    // handle same person twice with multiple ticket orders - Martin Wasiak

    return Promise.resolve()
}
