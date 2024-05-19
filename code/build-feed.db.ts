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

  return
}

buildFeed()
