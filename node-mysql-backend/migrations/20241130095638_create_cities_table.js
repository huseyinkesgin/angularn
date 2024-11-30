/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('cities').then(function(exists) {
    if (exists) {
      return knex.raw(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'cities' AND CONSTRAINT_NAME != 'PRIMARY'
      `).then((results) => {
        const dropForeignKeys = results[0].map(row => 
          knex.schema.alterTable('cities', function(table) {
            table.dropForeign(row.CONSTRAINT_NAME);
          })
        );
        return Promise.all(dropForeignKeys);
      }).then(function() {
        return knex.schema.dropTable('cities');
      });
    }
  }).then(function() {
    return knex.schema.createTable('cities', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('code').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('cities');
};
