import { log } from './utils/log'
import { getLatestUpdatedItemsAction } from './action'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { ok, safeTry } from 'neverthrow'
import { buildFeedFromItems } from './action/buildFeedFromItems'
import { saveToFile } from './action/saveToFile'

/* eslint-disable neverthrow/must-use-result -- ResultAsync対応してない？ */

const run = () =>
  safeTry(async function* () {
    log(`[feed] start`)
    const db = createDB()
    // １ヶ月以内のデータを取得
    const oneMonthAgo = dayjs().subtract(1, 'month')

    const items = yield* getLatestUpdatedItemsAction({ db, dateAfter: oneMonthAgo.toDate() }).safeUnwrap()

    const feed = yield* buildFeedFromItems({ items }).safeUnwrap()

    yield* saveToFile({ text: feed.atom1(), filePath: 'data/feed.xml' }).safeUnwrap()

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
