import type { PageStatus } from '@/domain/domain'
import { type ColumnType, type Generated, type Selectable } from 'kysely'

export type PageTable = {
  id: Generated<string>
  url: string

  title: string
  status: PageStatus
  limitPageNum: number
  lastCrawledAt: ColumnType<string, string, string>
}

export type Page = Selectable<PageTable>
