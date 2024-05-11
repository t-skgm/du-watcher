import type { ItemTable } from './model/Item.ts'
import type { PageTable } from './model/Page.ts'
import { Kysely } from 'kysely'
import { Database } from 'bun:sqlite'
import { BunSqliteDialect } from 'kysely-bun-sqlite'

export type KyselyDatabase = {
  items: ItemTable
  pages: PageTable
}

const dbPath = 'db.sqlite'

const dialect = new BunSqliteDialect({
  database: new Database(dbPath)
})

export type DB = Kysely<KyselyDatabase>

export const createDB = (): DB => new Kysely<KyselyDatabase>({ dialect })
