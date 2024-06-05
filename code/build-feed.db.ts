import { log } from './utils/log'
import { getLatestUpdatedItemsAction, buildFeedFromItemsAction, saveToFileAction } from './action'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { ok, safeTry } from 'neverthrow'
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

    const items = yield* getLatestUpdatedItemsAction({
      db,
      params: {
        dateAfter,
        limit: 200
      }
    }).safeUnwrap()

    const orderedItems = sortBy(items, item => item.updatedAt)

    const feed = yield* buildFeedFromItemsAction({ items: orderedItems }).safeUnwrap()

    yield* saveToFileAction({ text: feed.atom1(), filePath: 'pages/feed.xml' }).safeUnwrap()

    yield* addActionLogAction({ db, actionType: 'buildFeed', metadata: { itemCount: items.length } }).safeUnwrap()

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
