import { log } from './utils/log'
import { getLatestUpdatedItemsAction } from './action'
import { createDB } from './sdk/db/createDB'
import dayjs from 'dayjs'
import { Feed } from 'feed'

const run = () => {
  log(`[feed] start`)
  const db = createDB()
  // １ヶ月以内のデータを取得
  const oneMonthAgo = dayjs().subtract(1, 'month')

  return getLatestUpdatedItemsAction({ db, dateAfter: oneMonthAgo.toDate() }).andThen(items => {
    const feed = new Feed({
      title: 'DU Watcher',
      description: 'DU Watcher feed',
      id: 'du-watcher',
      copyright: 't-skgm',
      generator: 'du-watcher',
      author: {
        name: 't-skgm'
      }
    })
  })
}

await run().match(
  () => {
    log(`[feed] build finished`)
  },
  err => {
    console.error(err)
    process.exit(1)
  }
)
