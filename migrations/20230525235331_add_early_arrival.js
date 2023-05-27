
exports.up = async knex => {
    await knex.schema.alterTable('users', t => {
        t.boolean('early_arrival').defaultTo(false)
        t.string('early_arrival_role')
    })
  }
  


  exports.down = async knex => {
    await knex.schema.alterTable('users', t => {
        t.dropColumn('early_arrival');
        t.dropColumn('early_arrival_role');
    })

    console.log('\ndropped all tables\n'.toUpperCase())
  }
  