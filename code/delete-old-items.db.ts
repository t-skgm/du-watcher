import { log } from './utils/log'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { getOldItemsActions } from './action/getOldItems'
import { ok, safeTry } from 'neverthrow'

/* eslint-disable neverthrow/must-use-result -- ResultAsync対応してない？ */

const run = () =>
  safeTry(async function* () {
    log(`[crawl] start`)
    const db = createDB({ log: ['query'] })

    // １ヶ月以上前のデータを取得
    const oneMonthAgo = dayjs().subtract(1, 'month')
    console.log(`[crawl] delete items before: ${oneMonthAgo.toISOString()}`)

    const updated = yield* getOldItemsActions({ db, dateBefore: oneMonthAgo.toDate() }).safeUnwrap()

    return ok(updated)
  })

await run().then(result =>
  result.match(
    ([updated]) => {
      log(`[crawl] delete items finished. count:`, updated.numDeletedRows.toString())
    },
    err => {
      console.error(err)
      process.exit(1)
    }
  )
)
