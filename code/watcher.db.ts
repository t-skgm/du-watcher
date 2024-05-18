import { crawl } from '@/lib/crawler/crawl'
import { log } from './utils/log'
import { createDB } from './sdk/db/createDB'
import { saveItemsAction } from './action/saveItems'
import { ResultAsync, err, okAsync } from 'neverthrow'
import type { UpdateResult } from 'kysely'

const BASE_URL = process.env.DU_SITE_BASE_URL!

const run = (): ResultAsync<number, Error> => {
  log(`[crawl] start`)
  const db = createDB()

  log(`[crawl] query existing pages`)
  return ResultAsync.fromPromise(
    db.selectFrom('pages').selectAll().where('status', '=', 'ACTIVE').execute(),
    err => err as Error
  )
    .andThen(pages => {
      log(`[crawl] crawl starting: ${pages.length} pages`)

      let pageCount = 0
      let prevResult = okAsync<UpdateResult[], Error>([])

      for (const page of pages.slice(0, 1)) {
        if (page.url == null) continue
        pageCount++

        log(`[crawl] crawl #${pageCount}/${pages.length}, title: ${page.title}, url: ${page.url}`)

        const result = prevResult
          .andThen(
            () =>
              okAsync([
                {
                  itemId: '1008485133',
                  artist: 'ZUSAMMEN CLARK',
                  productTitle: 'EARLIER',
                  labelName: 'BRUIT DIRECT DISQUES',
                  genre: 'ROCK / POPS / INDIE',
                  cheapestItemPrice: '2,450円(税込)',
                  cheapestItemStatus: 'B',
                  media: 'LP(レコード)',
                  isDiscountedPrice: false,
                  discountRatePercentage: undefined,
                  itemPageUrl: 'https://diskunion.net/used/ct/indiealt/udetail/1008485133',
                  crawledAt: new Date('2024-05-12T03:02:00.549Z')
                }
              ])
            // ResultAsync.fromPromise(crawl({ targetUrl: page.url, baseUrl: BASE_URL }), err => err as Error)
          )
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
    .andThen(pageCount => {
      log(`[crawl] all crawl finished! page size: ${pageCount}`)
      return okAsync(pageCount)
    })
}

try {
  await run()
} catch (e) {
  console.error(e)
  process.exit(1)
}
