
exports.up = async knex => {

  if (!await knex.schema.hasTable('users')) {
    await knex.schema.createTable('users', t => {
      t.increments('user_id').unsigned().unique().primary()
      t.string('name').notNullable()
      t.string('email')
      t.string('phone')
      t.timestamp('updated_at')
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }

  if (!await knex.schema.hasTable('tickets')) {
    await knex.schema.createTable('tickets', t => {
      t.increments('ticket_id').unsigned().unique().primary()
      t.integer('user_id').unsigned().notNullable()
      t.boolean('redeemed').defaultTo(false)
      t.timestamp('updated_at')
      t.timestamp('created_at').defaultTo(knex.fn.now())
      t.foreign('user_id').references('user_id').inTable('users')
    })
  }

  // if (!await knex.schema.hasTable('users_tickets')) {
  //   await knex.schema.createTable('users_tickets', t => {
  //     t.increments('user_ticket_id').unsigned().unique().primary()
  //     t.integer('ticket_id').unsigned().notNullable()
  //     t.integer('user_id').unsigned().notNullable()
  //     t.timestamp('updated_at')
  //     t.timestamp('created_at').defaultTo(knex.fn.now())
  //     t.foreign('ticket_id').references('ticket_id').inTable('tickets')
  //     t.foreign('user_id').references('user_id').inTable('users')
  //   })
  // }
}

exports.down = async knex => {
  if (await knex.schema.hasTable('users_tickets')) await knex.schema.dropTable('users_tickets')
  if (await knex.schema.hasTable('users')) await knex.schema.dropTable('users')
  if (await knex.schema.hasTable('tickets')) await knex.schema.dropTable('tickets')

  console.log('\ndropped all tables\n'.toUpperCase())
}
