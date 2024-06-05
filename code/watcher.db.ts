import { crawl } from '@/lib/crawler/crawl'
import { log } from './utils/log'
import { createDB, type DB } from './sdk/db/createDB'
import { saveItemsAction } from './action/saveItems'
import { ResultAsync, ok, safeTry } from 'neverthrow'
import { getPagesAction } from './action/getPages'
import { savePageToCrawledAtAction } from './action/savePageToCrawledAt'
import type { Page } from './sdk/db/model/Page'
import { addActionLogAction } from './action/addActionLog'

const BASE_URL = process.env.DU_SITE_BASE_URL!

/* eslint-disable neverthrow/must-use-result -- ResultAsync対応してない？ */

const run = () =>
  safeTry(async function* () {
    log(`[crawl] start`)
    const db = createDB()

    log(`[crawl] log action start`)
    yield* addActionLogAction({ db, actionType: 'crawlStart', metadata: {} }).safeUnwrap()

    log(`[crawl] query existing pages`)
    const pages = yield* getPagesAction({ db }).safeUnwrap()

    log(`[crawl] crawl starting: ${pages.length} pages`)
    let pageCount = 1
    for (const page of pages) {
      if (page.url == null) continue
      log(`[crawl] crawl #${pageCount}/${pages.length}, title: ${page.title}, url: ${page.url}`)
      await _crawlAndSavePage(db, page)
      pageCount++
    }

    log(`[crawl] log action result`)
    yield* addActionLogAction({ db, actionType: 'crawlEnd', metadata: { pageCount } }).safeUnwrap()

    return ok(pageCount)
  })

const _crawlAndSavePage = async (db: DB, page: Page) =>
  safeTry(async function* () {
    const items = yield* ResultAsync.fromPromise(
      crawl({ targetUrl: page.url, baseUrl: BASE_URL }),
      err => err as Error
    ).safeUnwrap()

    log(`[crawl] save items... size: ${items.length}`)
    yield* saveItemsAction({ db })({ items, pageId: page.id }).safeUnwrap()

    log(`[crawl] update page crawled time`)
    const [saveResult] = yield* savePageToCrawledAtAction({ db, pageId: page.id }).safeUnwrap()

    log(`[crawl] save success: ${JSON.stringify(saveResult)}`)

    return ok(null)
  })

run().then(result =>
  result.match(
    pageCount => {
      log(`[crawl] all crawl finished! page size: ${pageCount}`)
    },
    err => {
      console.error(err)
      process.exit(1)
    }
  )
)
