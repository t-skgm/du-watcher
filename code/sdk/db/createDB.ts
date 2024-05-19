import type { ItemTable } from './model/Item.ts'
import type { PageTable } from './model/Page.ts'
import { Kysely, type KyselyConfig } from 'kysely'
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

export const createDB = (opt?: Omit<KyselyConfig, 'dialect'>): DB => new Kysely<KyselyDatabase>({ dialect, ...opt })
