import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'
import type { DB } from '@/sdk/db/createDB'
import type { ActionType } from '@/domain/domain'

export const findLastActionLogAction = ({ db, actionType }: { db: DB; actionType: ActionType }) =>
  ResultAsync.fromPromise(
    db
      .selectFrom('action_logs')
      .selectAll()
      .where('actionType', '=', actionType)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .executeTakeFirst(),
    err => err as SQLiteError
  )
