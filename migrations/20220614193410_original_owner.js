
exports.up = async knex => {
    await knex.schema.alterTable('tickets', t => {
        t.integer('original_owner_id')
    })
  }
  


  exports.down = async knex => {
    await knex.schema.alterTable('tickets', t => {
        t.dropColumn('original_owner_id');
    })
  }
  