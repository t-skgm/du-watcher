import { Kysely, type KyselyConfig } from 'kysely'
import { Database } from 'bun:sqlite'
import { BunSqliteDialect } from 'kysely-bun-sqlite'
import type { ItemTable } from './model/Item.ts'
import type { PageTable } from './model/Page.ts'
import type { ActionLogTable } from './model/ActionLog.ts'

export type KyselyDatabase = {
  items: ItemTable
  pages: PageTable
  action_logs: ActionLogTable
}

const dbPath = 'data/db.sqlite'

const dialect = new BunSqliteDialect({
  database: new Database(dbPath)
})

export type DB = Kysely<KyselyDatabase>

export const createDB = (opt?: Omit<KyselyConfig, 'dialect'>): DB => new Kysely<KyselyDatabase>({ dialect, ...opt })
