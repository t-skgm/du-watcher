import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'
import type { DB } from '@/sdk/db/createDB'

export const savePageToCrawledAtAction = ({
  db,
  pageId,
  crawledAt = new Date()
}: {
  db: DB
  pageId: string
  crawledAt?: Date
}) =>
  ResultAsync.fromPromise(
    db.updateTable('pages').set({ lastCrawledAt: crawledAt.toISOString() }).where('id', '=', pageId).execute(),
    err => err as SQLiteError
  )
