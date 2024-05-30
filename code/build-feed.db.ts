import { log } from './utils/log'
import { getLatestUpdatedItemsAction, buildFeedFromItemsAction, saveToFileAction } from './action'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { ok, safeTry } from 'neverthrow'
import { sortBy } from 'remeda'

/* eslint-disable neverthrow/must-use-result -- ResultAsync対応してない？ */

const run = () =>
  safeTry(async function* () {
    log(`[feed] start`)
    const db = createDB()
    // 2日以内作成のデータを取得
    const dateAfter = dayjs().subtract(2, 'day').toDate()

    const items = yield* getLatestUpdatedItemsAction({
      db,
      params: {
        dateAfter,
        limit: 100
      }
    }).safeUnwrap()

    const orderedItems = sortBy(items, item => item.updatedAt)

    const feed = yield* buildFeedFromItemsAction({ items: orderedItems }).safeUnwrap()

    yield* saveToFileAction({ text: feed.atom1(), filePath: 'pages/feed.xml' }).safeUnwrap()

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
