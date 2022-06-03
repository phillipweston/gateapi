
exports.up = async knex => {


    if (!await knex.schema.hasTable('groups')) {
      await knex.schema.createTable('groups', t => {
        t.increments('id').unsigned().unique().primary()
        t.enum('type', ['ticket', 'car']).notNull();
        t.timestamp('updated_at')
        t.timestamp('created_at').defaultTo(knex.fn.now())
      })
    }

    if (!await knex.schema.hasTable('ticket_groups')) {
      await knex.schema.createTable('ticket_groups', t => {
        t.increments('id').unsigned().unique().primary()
        t.integer('group_id').notNull()
        t.integer('ticket_id').notNull()
        t.timestamp('updated_at')
        t.timestamp('created_at').defaultTo(knex.fn.now())
      })
    }

    if (!await knex.schema.hasTable('car_groups')) {
      await knex.schema.createTable('car_groups', t => {
        t.increments('id').unsigned().unique().primary()
        t.integer('group_id').notNull()
        t.integer('user_id').notNull()
        t.string('license_plate')
        t.timestamp('updated_at')
        t.timestamp('created_at').defaultTo(knex.fn.now())
      })
    }

    await knex.schema.alterTable('users', t => {
        t.timestamp('waiver')
        t.timestamp('health')
        t.string('license_plate')
    })
  }
  


  exports.down = async knex => {
    if (await knex.schema.hasTable('audit_log')) await knex.schema.dropTable('audit_log')
  
      
    await knex.schema.alterTable('users', t => {
        t.dropColumn('waiver');
        t.dropColumn('health');
        t.dropColumn('license_plate')
    })

    console.log('\ndropped all tables\n'.toUpperCase())
  }
  