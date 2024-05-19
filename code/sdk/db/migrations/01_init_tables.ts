import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  // pages
  await db.schema
    .createTable('pages')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('url', 'text', col => col.notNull().unique())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('status', 'text', col => col.notNull())
    // 取得するページ数
    .addColumn('limitPageNum', 'integer', col => col.notNull().defaultTo(5))
    .addColumn('lastCrawledAt', 'text', col => col.notNull().defaultTo(sql`(DATETIME('now', 'localtime'))`))
    .execute()

  // item table
  await db.schema
    .createTable('items')
    .addColumn('itemId', 'text', col => col.primaryKey())
    .addColumn('itemPageUrl', 'text', col => col.notNull())
    .addColumn('artist', 'text', col => col.notNull())
    .addColumn('productTitle', 'text', col => col.notNull())
    .addColumn('labelName', 'text')
    .addColumn('genre', 'text', col => col.notNull())
    .addColumn('cheapestItemPrice', 'integer', col => col.notNull())
    .addColumn('cheapestItemStatus', 'text', col => col.notNull())
    .addColumn('isDiscountedPrice', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('discountRatePercentage', 'integer', col => col.notNull().defaultTo(0.0))
    .addColumn('media', 'text', col => col.notNull())
    .addColumn('crawledAt', 'text', col => col.notNull())
    .addColumn('createdAt', 'text', col => col.notNull().defaultTo(sql`(DATETIME('now', 'localtime'))`))
    .addColumn('updatedAt', 'text', col => col.notNull().defaultTo(sql`(DATETIME('now', 'localtime'))`))
    .addColumn('pageId', 'text', col => col.notNull().references('pages.id').onDelete('cascade'))
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('pages').execute()
  await db.schema.dropTable('items').execute()
}
