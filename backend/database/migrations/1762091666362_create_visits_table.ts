import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'visits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('country_code', 3).notNullable() //Iso 3166-1
      table.date('visited_at').nullable()

      //relations
      table.unique(['user_id', 'country_code'])

      //FK
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      //Timestamp
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
