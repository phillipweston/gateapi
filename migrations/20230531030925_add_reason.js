
exports.up = async knex => {
    await knex.schema.alterTable('users', t => {
        t.string('reason')
    })
  }
  
  exports.down = async knex => {
    await knex.schema.alterTable('users', t => {
        t.dropColumn('reason');
    })

    console.log('\ndropped all tables\n'.toUpperCase())
  }
  