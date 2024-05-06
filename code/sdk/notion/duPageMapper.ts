import type { PagePage } from './notion.interface'

type DuPage = {
  id: string
  url: string | undefined
  title: string
  lastCrawledAt: string | undefined
  status: string | undefined
}

export const duPageMapper = (p: PagePage): DuPage => ({
  id: p.id,
  url: p.properties.URL.url ?? undefined,
  title: p.properties.Title.title[0].plain_text,
  lastCrawledAt: p.properties.LastCrawled.date?.start,
  status: p.properties.Status.select?.name
})

export const isPagePage = (p: object): p is PagePage =>
  'properties' in p &&
  typeof p.properties === 'object' &&
  p.properties != null &&
  'Title' in p.properties &&
  p.properties.Title != null
