import { sleep } from 'bun'
import { buildPageUrl } from './buildPageUrl'
import { fetchHTML } from './fetchHTML'
import { hasNextPage } from './parser/hasNextPage'
import { parsePages } from './parser/parsePages'

/** crawl (with sleeping) */
export const crawl = async ({
  targetUrl,
  baseUrl,
  maxPageNum = 5,
  sleepMs = 300
}: {
  targetUrl: string
  baseUrl: string
  maxPageNum?: number
  sleepMs?: number
}) => {
  const htmls: string[] = []

  // fetch with pagenate
  for (let pageNo = 1; pageNo <= maxPageNum; pageNo++) {
    const html = await fetchHTML({ url: buildPageUrl(targetUrl, pageNo), referer: `${baseUrl}/used` })
    htmls.push(html)
    if (!hasNextPage(html)) break
    await sleep(sleepMs)
  }

  const result = parsePages(htmls, baseUrl)

  return result
}
