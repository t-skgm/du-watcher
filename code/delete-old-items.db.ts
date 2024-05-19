import { log } from './utils/log'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { getOldItemsActions } from './action/getOldItems'

const run = () => {
  log(`[crawl] start`)
  const db = createDB({ log: ['query'] })

  // １ヶ月以上前のデータを取得
  const oneMonthAgo = dayjs().subtract(1, 'month')
  console.log(`[crawl] delete items before: ${oneMonthAgo.toISOString()}`)

  return getOldItemsActions(db, oneMonthAgo.toDate())
}

await run().match(
  ([result]) => {
    log(`[crawl] delete items finished. count:`, result.numDeletedRows.toString())
  },
  err => {
    console.error(err)
    process.exit(1)
  }
)
