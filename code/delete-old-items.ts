import { createNotionClient, notionPages } from '@/sdk/notion/notion'
import { sleep } from 'bun'

const log = console.log
// const logMore = (...args: any[]) => console.dir(...args, { depth: 10 })

const deleteOldItems = async () => {
  log(`[crawl] start`)
  const client = createNotionClient()

  // １ヶ月以上前のデータを取得
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  console.log(`[crawl] delete items before: ${oneMonthAgo.toISOString()}`)

  let pageIdx = 1
  let nextPageCursor: string | null = '<init>'

  while (nextPageCursor != null) {
    console.log(`[crawl] query items [on page: ${pageIdx}]`)

    const res = await client.databases.query({
      database_id: notionPages.itemsDbID,
      page_size: 100,
      filter: {
        property: 'Crawled',
        date: {
          before: oneMonthAgo.toISOString()
        }
      }
    })

    // archivedにする
    const items = res.results
    log(`[crawl] delete items [on page: ${pageIdx}]`)

    let idx = 1
    for (const item of items) {
      if (idx % 10 === 1) log(`[crawl] delete #${idx}/${items.length} [on page: ${pageIdx}]`)

      await client.pages.update({
        page_id: item.id,
        archived: true
      })
      await sleep(50)
      idx += 1
    }

    nextPageCursor = res.next_cursor

    pageIdx += 1
  }
}

deleteOldItems().catch(async e => {
  console.error(e)
  process.exit(1)
})
