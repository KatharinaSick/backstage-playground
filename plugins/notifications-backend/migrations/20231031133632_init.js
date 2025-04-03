// @ts-check

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('notifications', table => {
    table
      .string('message')
      .notNullable()
      .comment('The message of the notification');
    table
      .string('channel')
      .notNullable()
      .comment('The channel the notification was published to');
    table
      .string('origin')
      .notNullable()
      .comment('The source of the notification');
    table
      .timestamp('timestamp')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('When the notification was sent');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('notifications');
};