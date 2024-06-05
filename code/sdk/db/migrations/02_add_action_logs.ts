import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  // item table
  await db.schema
    .createTable('action_logs')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('actionType', 'text', col => col.notNull())
    .addColumn('metadata', 'text', col => col.notNull())
    .addColumn('createdAt', 'text', col => col.notNull().defaultTo(sql`(DATETIME('now', 'localtime'))`))
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('action_logs').execute()
}
