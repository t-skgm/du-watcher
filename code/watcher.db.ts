import { crawl } from '@/lib/crawler/crawl'
import { log } from './utils/log'
import { createDB } from './sdk/db/createDB'
import { saveItemsAction } from './action/saveItems'

const BASE_URL = process.env.DU_SITE_BASE_URL!

const run = async () => {
  log(`[crawl] start`)
  const db = createDB()

  log(`[crawl] query existing pages`)
  const pages = await db.selectFrom('pages').selectAll().where('status', '=', 'ACTIVE').execute()

  log(`[crawl] crawl starting: ${pages.length} pages`)

  let pageCount = 0
  for (const page of pages.slice(0, 1)) {
    if (page.url == null) continue
    pageCount++

    log(`[crawl] crawl #${pageCount}/${pages.length}, title: ${page.title}, url: ${page.url}`)

    const items = await crawl({ targetUrl: page.url, baseUrl: BASE_URL })
    log(`[crawl] crawl success`)

    log(`[crawl] save items... size: ${items.length}`)
    await saveItemsAction({ db })({ items, pageId: page.id })

    log(`[crawl] update page`)
    db.updateTable('pages').set({ lastCrawledAt: new Date() }).where('id', '=', page.id).execute()
  }

  log(`[crawl] all crawl finished! page size: ${pageCount}`)
}

run().catch(async e => {
  console.error(e)
  process.exit(1)
})
