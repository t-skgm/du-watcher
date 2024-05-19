import type { DB } from '@/sdk/db/createDB'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'

export const getPagesAction = ({ db }: { db: DB }) =>
  ResultAsync.fromPromise(
    db.selectFrom('pages').selectAll().where('status', '=', 'ACTIVE').execute(),
    err => err as SQLiteError
  )
