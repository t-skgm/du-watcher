import { type ColumnType, type Selectable } from 'kysely'

export type FeedTable = {
  feedId: string
  name: string
  description: string
  createdAt: ColumnType<string, string | undefined, string>
  updatedAt: ColumnType<string, string | undefined, string>
}

export type Feed = Selectable<FeedTable>
