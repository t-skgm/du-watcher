import type { PageStatus } from '@/domain/domain'
import { type Generated, type Selectable } from 'kysely'

export type PageTable = {
  id: Generated<string>
  url: string

  title: string
  status: PageStatus
  limitPageNum: number
  lastCrawledAt: Date
}

export type Page = Selectable<PageTable>
