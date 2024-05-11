import type { PageStatus } from '@/domain/domain'
import { type Selectable } from 'kysely'

export type PageTable = {
  url: string

  title: string
  status: PageStatus
  lastCrawled: Date
}

export type Page = Selectable<PageTable>
