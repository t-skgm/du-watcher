import { Client } from '@notionhq/client'

export const createNotionClient = () =>
  new Client({
    auth: process.env['NOTION_API_SECRET']
  })
