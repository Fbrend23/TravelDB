import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RemoveUniqueConstraintFromVisits extends BaseSchema {
  protected tableName = 'visits'

  public async up() {
    // Supprimer la FOREIGN KEY existante
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      DROP FOREIGN KEY \`visits_user_id_foreign\`;
    `)

    // Supprimer la contrainte UNIQUE qui bloque les doublons
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      DROP INDEX \`visits_user_id_country_code_unique\`;
    `)

    // Recréer proprement la FOREIGN KEY
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      ADD CONSTRAINT \`visits_user_id_foreign\`
      FOREIGN KEY (\`user_id\`)
      REFERENCES \`users\`(\`id\`)
      ON DELETE CASCADE;
    `)
  }

  public async down() {
    // Supprime la FK
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      DROP FOREIGN KEY \`visits_user_id_foreign\`;
    `)

    // Recréer la contrainte UNIQUE
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      ADD UNIQUE \`visits_user_id_country_code_unique\`(\`user_id\`, \`country_code\`);
    `)

    // Recréer la FK
    this.schema.raw(`
      ALTER TABLE \`${this.tableName}\`
      ADD CONSTRAINT \`visits_user_id_foreign\`
      FOREIGN KEY (\`user_id\`)
      REFERENCES \`users\`(\`id\`)
      ON DELETE CASCADE;
    `)
  }
}
