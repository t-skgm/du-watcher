import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'
import type { DB } from '@/sdk/db/createDB'
import type { ActionType } from '@/domain/domain'

export const addActionLogAction = ({
  db,
  actionType,
  metadata
}: {
  db: DB
  actionType: ActionType
  metadata: Record<string, unknown>
}) =>
  ResultAsync.fromPromise(
    db
      .insertInto('action_logs')
      .values({
        actionType: actionType,
        metadata: JSON.stringify(metadata)
      })
      .execute(),
    err => err as SQLiteError
  )
