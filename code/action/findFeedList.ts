import type { DB } from '@/sdk/db/createDB'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'

export const findFeedListAction = ({ db }: { db: DB }) =>
  ResultAsync.fromPromise(db.selectFrom('feeds').selectAll().execute(), err => err as Error | SQLiteError)
