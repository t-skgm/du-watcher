import { Client } from '@notionhq/client'

export const createNotionClient = () =>
  new Client({
    auth: process.env['NOTION_API_SECRET']
  })

export const notionPages = {
  pagesDbID: '2a2a83e9612f4d8590c26a1a970257aa',
  itemsDbID: '9ebd2dd4bf614ada99a850d7c75675c9'
}
