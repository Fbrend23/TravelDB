import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RemoveUniqueConstraintFromVisits extends BaseSchema {
  protected tableName = 'visits'

  public async up() {
    // Delete existing fk
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      DROP FOREIGN KEY \`visits_user_id_foreign\`;
    `)

    // Delete unique constraint
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      DROP INDEX \`visits_user_id_country_code_unique\`;
    `)

    // recreate the fk
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      ADD CONSTRAINT \`visits_user_id_foreign\`
      FOREIGN KEY (\`user_id\`)
      REFERENCES \`users\`(\`id\`)
      ON DELETE CASCADE;
    `)
  }

  public async down() {
    // delete fk
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      DROP FOREIGN KEY \`visits_user_id_foreign\`;
    `)

    // recreate unisque constraint
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      ADD UNIQUE \`visits_user_id_country_code_unique\`(\`user_id\`, \`country_code\`);
    `)

    // recreate fk
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      ADD CONSTRAINT \`visits_user_id_foreign\`
      FOREIGN KEY (\`user_id\`)
      REFERENCES \`users\`(\`id\`)
      ON DELETE CASCADE;
    `)
  }
}
