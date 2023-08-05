import { PagePage } from '@/domain/notion'
import { crawl } from '../lib/crawl'
import { saveItems } from '../lib/saveItemsNotion'
import { createNotionClient, notionPages } from '@/lib/notion'

const log = console.log
const logMore = (...args: any[]) => console.dir(...args, { depth: 10 })
const BASE_URL = process.env.DU_SITE_BASE_URL!

const MAX_PAGE_SIZE = 100

const run = async () => {
  log(`[crawl] start`)
  const client = createNotionClient()

  log(`[crawl] query existing pages`)
  const pagesRes = await client.databases.query({ database_id: notionPages.pagesDbID, page_size: MAX_PAGE_SIZE })

  const pages = (pagesRes.results as PagePage[]).map(p => ({
    id: p.id,
    url: p.properties.URL.url ?? undefined,
    title: p.properties.Title.title[0].plain_text,
    lastCrawledAt: p.properties.LastCrawled.date?.start,
    status: p.properties.Status.select?.name
  }))
  log(`[crawl] crawl starting: ${pages.length} pages`)

  let pageCount = 0
  for (const page of pages) {
    if (page.url == null) continue
    pageCount++

    log(`[crawl] crawl #${pageCount}/${pages.length}, title: ${page.title}, url: ${page.url}`)

    const items = await crawl({ targetUrl: page.url, baseUrl: BASE_URL })
    log(`[crawl] crawl success`)

    log(`[crawl] save items... size: ${items.length}`)
    await saveItems(client, { items, pageId: page.id })

    log(`[crawl] update page`)
    await client.pages.update({
      page_id: page.id,
      properties: {
        LastCrawled: { date: { start: new Date().toISOString() } }
      }
    })
  }

  log(`[crawl] all crawl finished! page size: ${pageCount}`)
}

run().catch(async e => {
  console.error(e)
  process.exit(1)
})
