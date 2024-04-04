import type { PagePage } from './notion.interface'
import { Client } from '@notionhq/client'
import retry from 'async-retry'

const MAX_PAGE_SIZE = 100

export const queryExistingNotionPages = async (notionClient: Client, { pagesDbID }: { pagesDbID: string }) => {
  const pagesRes = await retry(
    () => notionClient.databases.query({ database_id: pagesDbID, page_size: MAX_PAGE_SIZE }),
    {
      retries: 3
    }
  )

  const pages = (pagesRes.results as PagePage[])
    .map(p => ({
      id: p.id,
      url: p.properties.URL.url ?? undefined,
      title: p.properties.Title.title[0].plain_text,
      lastCrawledAt: p.properties.LastCrawled.date?.start,
      status: p.properties.Status.select?.name
    }))
    .filter(p => p.status === 'ACTIVE')

  return pages
}
