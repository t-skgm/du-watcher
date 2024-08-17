import type { DB } from '@/sdk/db/createDB'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'

export const getLatestUpdatedItemsAction = ({
  db,
  params: { dateAfter, feedId, limit = 100 }
}: {
  db: DB
  params: {
    feedId: string
    dateAfter: Date
    limit?: number
  }
}) =>
  ResultAsync.fromPromise(
    db
      .selectFrom('items')
      .selectAll()
      .where('updatedAt', '>=', dateAfter.toISOString())
      .where('pageId', 'in', db.selectFrom('pages').select('id').where('feedId', '=', feedId))
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .execute(),
    err => err as Error | SQLiteError
  )
