import type { DB } from '@/sdk/db/createDB'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'

export const getLatestUpdatedItemsAction = ({ db, dateAfter }: { db: DB; dateAfter: Date }) =>
  ResultAsync.fromPromise(
    db.selectFrom('items').selectAll().where('updatedAt', '>=', dateAfter.toISOString()).execute(),
    err => err as Error | SQLiteError
  )
