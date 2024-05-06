import type { PagePage } from './notion.interface'
import { Client } from '@notionhq/client'
import { type QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import retry from 'async-retry'
import { duPageMapper } from './duPageMapper'

const MAX_PAGE_SIZE = 100

export const queryExistingNotionPages = async (
  notionClient: Client,
  { pagesDbID, filter }: { pagesDbID: string; filter?: QueryDatabaseParameters['filter'] }
) => {
  const pagesRes = await retry(
    () => notionClient.databases.query({ database_id: pagesDbID, page_size: MAX_PAGE_SIZE, filter }),
    { retries: 3 }
  )

  return (pagesRes.results as PagePage[]).map(duPageMapper).filter(p => p.status === 'ACTIVE')
}
