import type { DB } from '@/sdk/db/createDB'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'

export const getLatestUpdatedItemsAction = ({
  db,
  params: { dateAfter, limit = 100 }
}: {
  db: DB
  params: {
    dateAfter: Date
    limit?: number
  }
}) =>
  ResultAsync.fromPromise(
    db
      .selectFrom('items')
      .selectAll()
      .where('updatedAt', '>=', dateAfter.toISOString())
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .execute(),
    err => err as Error | SQLiteError
  )
