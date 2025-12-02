// database/migrations/xxx_add_email_verified_at_to_users.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('email_verified_at', { useTz: true }).nullable().after('email')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email_verified_at')
    })
  }
}
