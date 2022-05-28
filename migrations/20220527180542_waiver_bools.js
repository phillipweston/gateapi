
exports.up = async knex => {
    if (!await knex.schema.hasTable('audit_log')) {
      await knex.schema.createTable('audit_log', t => {
        t.increments('id').unsigned().unique().primary()
        t.integer('from_id')
        t.integer('to_id')
        t.integer('ticket_id')
        t.enum('action', ['redeem', 'waiver', 'health', 'license', 'transfer']).notNull();
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
  