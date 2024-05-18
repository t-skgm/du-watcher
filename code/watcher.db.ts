import { crawl } from '@/lib/crawler/crawl'
import { log } from './utils/log'
import { createDB } from './sdk/db/createDB'
import { saveItemsAction } from './action/saveItems'
import { ResultAsync } from 'neverthrow'
import { SQLiteError } from 'bun:sqlite'
import { getPagesAction } from './action/getPages'
import { savePageToCrawledAtAction } from './action/savePageToCrawledAt'

const BASE_URL = process.env.DU_SITE_BASE_URL!

const run = () => {
  log(`[crawl] start`)
  const db = createDB()

  log(`[crawl] query existing pages`)
  return getPagesAction({ db }).andThen(
    ResultAsync.fromThrowable(
      async pages => {
        log(`[crawl] crawl starting: ${pages.length} pages`)

        let pageCount = 0

        for (const page of pages) {
          if (page.url == null) continue
          pageCount++

          log(`[crawl] crawl #${pageCount}/${pages.length}, title: ${page.title}, url: ${page.url}`)

          const result = await ResultAsync.fromPromise(
            crawl({ targetUrl: page.url, baseUrl: BASE_URL }),
            err => err as Error
          )
            .andThen(items => {
              log(`[crawl] save items... size: ${items.length}`)
              return saveItemsAction({ db })({ items, pageId: page.id })
            })
            .andThen(() => {
              log(`[crawl] update page crawled time`)
              return savePageToCrawledAtAction({ db, pageId: page.id })
            })

          if (result.isErr()) {
            log(`[crawl] error: ${result.error.message} on ${page.title}, but continue.`)
          }
        }

        return pageCount
      },
      err => err as Error | SQLiteError
    )
  )
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
