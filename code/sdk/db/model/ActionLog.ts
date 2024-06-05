import type { ActionType } from '@/domain/domain'
import { type ColumnType, type Generated, type Selectable } from 'kysely'

export type ActionLogTable = {
  id: Generated<number>
  actionType: ActionType
  metadata: string
  createdAt: ColumnType<string, string | undefined, string>
}

export type ActionLog = Selectable<ActionLogTable>
