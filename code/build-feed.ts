import { createNotionClient, queryDatabase } from '@/sdk/notion/notion.result'
// import { sleep } from 'bun'
import { log } from './utils/log'
import { getEnv } from './lib/env'
import { notionPages } from './sdk/notion/constant'
import { ResultAsync } from 'neverthrow'
import { duPageMapper, isPagePage } from './sdk/notion/duPageMapper'
import { getLatestDate } from './utils/date'

const buildFeed = async () => {
  log(`[feed] start`)

  const clientResult = getEnv().andThen(createNotionClient)
  if (clientResult.isErr()) return clientResult

  const client = clientResult.value

  return (
    queryDatabase(client, {
      pagesDbID: notionPages.pagesDbID,
      filter: { property: 'Status', select: { equals: 'ACTIVE' } }
    })
      // to page obj
      .map(queryRes => queryRes.filter(isPagePage).map(duPageMapper).slice(0, 1))
      // get items of each page
      .andThen(pages =>
        ResultAsync.combine(
          pages.map(page =>
            queryDatabase(client, {
              pagesDbID: notionPages.itemsDbID,
              filter: {
                and: [
                  {
                    property: 'Page',
                    relation: { contains: page.id }
                  },
                  {
                    property: 'Updated',
                    date: {
                      after: getLatestDate(new Date()).toISOString()
                    }
                  }
                ]
              }
            })
          )
        ).map(v => {
          console.log(v)
          return v.map((pageItems, idx) => ({ page: pages[idx], items: pageItems }))
        })
      )
      .map(pageItems => {
        // console.log(pageItems)
        return pageItems
      })
  )
}

buildFeed()
  .then(result => {
    if (result.isErr()) {
      console.error('[error]', result.error)
      process.exit(1)
    }
    console.log('[finish]', result.value)
  })
  .catch(async e => {
    console.error(e)
    process.exit(1)
  })
