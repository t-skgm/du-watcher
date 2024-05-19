import type { DB } from '@/sdk/db/createDB'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'

export const getOldItemsActions = (db: DB, dateBefore: Date) =>
  ResultAsync.fromPromise(
    db.deleteFrom('items').where('crawledAt', '<=', dateBefore.toISOString()).execute(),
    err => err as Error | SQLiteError
  )
