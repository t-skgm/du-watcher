import { crawl } from '@/lib/crawler/crawl'
import { log } from './utils/log'
import { createDB } from './sdk/db/createDB'
import { saveItemsAction } from './action/saveItems'
import { ResultAsync, okAsync } from 'neverthrow'
import type { UpdateResult } from 'kysely'
import { getPagesAction } from './action/getPages'

const BASE_URL = process.env.DU_SITE_BASE_URL!

const run = () => {
  log(`[crawl] start`)
  const db = createDB()

  log(`[crawl] query existing pages`)
  return getPagesAction({ db }).andThen(pages => {
    log(`[crawl] crawl starting: ${pages.length} pages`)

    let pageCount = 0
    let prevResult = okAsync<UpdateResult[], Error>([])

    for (const page of pages) {
      if (page.url == null) continue
      pageCount++

      log(`[crawl] crawl #${pageCount}/${pages.length}, title: ${page.title}, url: ${page.url}`)

      const result = prevResult
        .andThen(() => ResultAsync.fromPromise(crawl({ targetUrl: page.url, baseUrl: BASE_URL }), err => err as Error))
        .andThen(items => {
          log(`[crawl] save items... size: ${items.length}`)
          return saveItemsAction({ db })({ items, pageId: page.id })
        })
        .andThen(() => {
          log(`[crawl] update page crawled time`)
          return ResultAsync.fromPromise(
            db
              .updateTable('pages')
              .set({ lastCrawledAt: new Date().toISOString() })
              .where('id', '=', page.id)
              .execute(),
            err => err as Error
          )
        })
        .mapErr(err => {
          console.error(err)
          return err
        })
      prevResult = result
    }

    return prevResult.andThen(_ => okAsync(pageCount))
  })
}

run()
  .match(
    pageCount => {
      log(`[crawl] all crawl finished! page size: ${pageCount}`)
    },
    err => {
      throw err
    }
  )
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
