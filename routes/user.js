const router = require('koa-router')()

const asyncForEach = require('../utils/asyncForEach')

const { User, Ticket } = require('../models')

module.exports = ({ psql, knex }) => {
    User.knex(psql)
    Ticket.knex(psql)

    router.get('/users', getUsers)
    router.get('/users/:id', getUser)
    router.post('/users/waiver', signWaiver)

    async function signWaiver(ctx, next) {
        const { first, last, user_id } = ctx.body
        try {
            let user = await User.query().where({ user_id }).first()
            user = await user.$query().updateAndFetch({
                name: `${first} ${last}`,
                waiver: new Date().toISOString(),
            })
            await Audit.query().insert({
                action: 'waiver',
                to_id: user.user_id,
                from_id: user.user_id,
            })
            ctx.body = user
        } catch (error) {
            ctx.status = 500
            ctx.body = error
        }
    }

    async function getUsers(ctx, next) {
        ctx.body = await User.query().withGraphFetched('[tickets]')
    }

    async function getUser(ctx, next) {
        ctx.body = await User.query()
            .where({ user_id: ctx.params.id })
            .withGraphFetched('[tickets]')
            .first()
    }

    return router
}
