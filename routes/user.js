const router = require('koa-router')()

const asyncForEach = require('../utils/asyncForEach')

const { User, Ticket, Audit } = require('../models')

module.exports = ({ psql, knex }) => {
    User.knex(psql)
    Ticket.knex(psql)
    Audit.knex(psql)

    router.get('/users', getUsers)
    router.get('/users/:id', getUser)
    router.post('/users/waiver', signWaiver)
    router.post('/users/health', signHealth)

    async function signWaiver(ctx, next) {
        const { name, user_id } = ctx.request.body
        try {
            let user = await User.query().findOne({ user_id })
            user = await user.$query().updateAndFetch({
                name,
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

    async function signHealth(ctx, next) {
        const { user_id } = ctx.request.body
        try {
            let user = await User.query().findOne({ user_id })
            user = await user.$query().updateAndFetch({
                health: new Date().toISOString(),
            })
            await Audit.query().insert({
                action: 'health',
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
        ctx.body = await User.query().withGraphFetched(
            '[tickets,tickets.owner,tickets.originalOwner]'
        )
    }

    async function getUser(ctx, next) {
        ctx.body = await User.query()
            .where({ user_id: ctx.params.id })
            .withGraphFetched('[tickets,tickets.owner,tickets.originalOwner]')
            .first()
    }

    return router
}
