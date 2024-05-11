import type { ItemTable } from './model/Item.ts'
import type { PageTable } from './model/Page.ts'
import { Kysely } from 'kysely'
import { Database } from 'bun:sqlite'
import { BunSqliteDialect } from 'kysely-bun-sqlite'

export type KyselyDatabase = {
  item: ItemTable
  page: PageTable
}

const dbPath = 'db.sqlite'

const dialect = new BunSqliteDialect({
  database: new Database(dbPath)
})

export const createDB = () => new Kysely<KyselyDatabase>({ dialect })
