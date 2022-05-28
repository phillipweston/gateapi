const { Model } = require('objection')

module.exports = class Ticket extends Model {
  static get tableName () {
    return 'audit_log'
  }

  static get idColumn () {
    return 'id'
  }

  static get relationMappings () {
    // import models here to prevent require loops
    const User = require('./user')
    const Ticket = require('./ticket')

    return {
      from: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `audit_log.from_id`,
          to: `users.user_id`
        }
      },
      to: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `audit_log.to_id`,
          to: `users.user_id`
        }
      },
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: `audit_log.ticket_id`,
          to: `tickets.ticket_id`
        }
      }
    }
  }
}
