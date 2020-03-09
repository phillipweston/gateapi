const { Model } = require('objection')

module.exports = class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get idColumn () {
    return 'user_id'
  }

  static get relationMappings () {
    // import models here to prevent require loops
    const Ticket = require('./ticket')

    return {
      tickets: {
        relation: Model.HasManyRelation,
        modelClass: Ticket,
        join: {
          from: 'users.user_id',
          to: 'tickets.user_id'
        }
      }
    }
  }
}
