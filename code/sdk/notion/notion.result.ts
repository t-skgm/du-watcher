import type { Env } from '@/lib/env'
import { Client, RequestTimeoutError, type NotionClientError } from '@notionhq/client'
import { type QueryDatabaseResponse, type QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import { Result, ResultAsync } from 'neverthrow'
import retry from 'async-retry'
import { sleep } from 'bun'
import { APIErrorCode, isHTTPResponseError, isNotionClientError } from '@notionhq/client/build/src/errors'

export const createNotionClient = Result.fromThrowable(
  (env: Env) => new Client({ auth: env.auth }),
  error => error as Error
)

const MAX_PAGE_SIZE = 100

export const queryDatabase = ResultAsync.fromThrowable(
  async (
    notionClient: Client,
    { pagesDbID, filter }: { pagesDbID: string; filter?: QueryDatabaseParameters['filter'] }
  ) => {
    let hasMore = true
    const results: QueryDatabaseResponse['results'] = []

    while (hasMore) {
      const pagesRes = await retry(
        async bail => {
          try {
            return await notionClient.databases.query({ database_id: pagesDbID, page_size: MAX_PAGE_SIZE, filter })
          } catch (error) {
            // Timeout/RateLimitedなら再試行
            if (
              RequestTimeoutError.isRequestTimeoutError(error) ||
              (isHTTPResponseError(error) && error.code === APIErrorCode.RateLimited)
            ) {
              await sleep(300)
              throw error
            }

            // そのほかのエラーは終了
            bail(error as Error)
            throw error
          }
        },
        { retries: 3 }
      )

      results.push(...pagesRes.results)
      hasMore = pagesRes.has_more

      await sleep(50)
    }

    return results
  },
  error => {
    if (isNotionClientError(error)) {
      return error
    }
    throw error as Error
  }
)
