import { log } from './utils/log'
import { getLatestUpdatedItemsAction, buildFeedFromItemsAction, saveToFileAction, findFeedListAction } from './action'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { ResultAsync, ok, safeTry } from 'neverthrow'
import { sortBy } from 'remeda'
import { findLastActionLogAction } from './action/findLastActionLog'
import { addActionLogAction } from './action/addActionLog'

/* eslint-disable neverthrow/must-use-result -- ResultAsync対応してない？ */

const run = () =>
  safeTry(async function* () {
    log(`[feed] start`)
    const db = createDB()
    const lastAcionLog = yield* findLastActionLogAction({ db, actionType: 'crawlStart' }).safeUnwrap()

    const dateAfter = lastAcionLog?.createdAt
      ? dayjs(lastAcionLog.createdAt).toDate()
      : // crawl logがなければ前日から
        dayjs().subtract(1, 'day').toDate()

    log(`[feed] find items updated after: ${dateAfter.toLocaleString('ja')}`)

    const feeds = yield* findFeedListAction({ db }).safeUnwrap()

    const results = feeds.map(feedItem =>
      ResultAsync.fromPromise(
        safeTry(async function* () {
          log(`[feed] build feed: ${feedItem.feedId}`)

          const items = yield* getLatestUpdatedItemsAction({
            db,
            params: {
              feedId: feedItem.feedId,
              dateAfter,
              limit: 200
            }
          }).safeUnwrap()

          const orderedItems = sortBy(items, item => item.updatedAt)

          const feed = yield* buildFeedFromItemsAction({ items: orderedItems, feedItem }).safeUnwrap()

          yield* saveToFileAction({ text: feed.atom1(), filePath: `pages/feed_${feedItem.feedId}.xml` }).safeUnwrap()

          return ok(null)
        }),
        err => err as Error
      )
    )
    const feedResults = yield* ResultAsync.combineWithAllErrors(results)
      .mapErr(errs => errs[0])
      .safeUnwrap()

    yield* addActionLogAction({
      db,
      actionType: 'buildFeed',
      metadata: { itemCount: feedResults.length }
    }).safeUnwrap()

    return ok(null)
  })

await run().then(result =>
  result.match(
    () => {
      log(`[feed] build finished`)
    },
    err => {
      console.error(err)
      process.exit(1)
    }
  )
)
