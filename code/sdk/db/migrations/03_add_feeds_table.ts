import { Kysely, sql } from 'kysely'
import { tableNames } from '../model/tableNames'

export async function up(db: Kysely<unknown>): Promise<void> {
  // feeeds table
  await db.schema
    .createTable(tableNames.feeds)
    .addColumn('feedId', 'text', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('description', 'text', col => col.notNull())
    .addColumn('createdAt', 'text', col => col.notNull().defaultTo(sql`(DATETIME('now', 'localtime'))`))
    .addColumn('updatedAt', 'text', col => col.notNull().defaultTo(sql`(DATETIME('now', 'localtime'))`))
    .execute()

  // add feedId col to page table
  await db.schema
    .alterTable(tableNames.pages)
    .addColumn('feedId', 'text', col => col.references('feeds.feedId').onDelete('cascade'))
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable(tableNames.feeds).execute()
  await db.schema.alterTable(tableNames.pages).dropColumn('feedId').execute()
}
