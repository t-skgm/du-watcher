import { fetchHTML } from './fetchHTML'
import { parseNextPageUrl } from './parser/parseNextPageUrl'
import { parsePages } from './parser/parsePages'
import { sleep } from '@/utils/sleep'

/** crawl (with sleeping) */
export const crawl = async ({
  targetUrl,
  baseUrl,
  sleepMs = 300
}: {
  targetUrl: string
  baseUrl: string
  sleepMs?: number
}) => {
  const htmls: string[] = []
  let nextPageUrl: string | undefined = targetUrl

  // fetch with pagenate
  while (nextPageUrl != null) {
    const firstHtml = await fetchHTML({ url: nextPageUrl, referer: `${baseUrl}/used/` })
    nextPageUrl = parseNextPageUrl(firstHtml, baseUrl)
    htmls.push(firstHtml)
    sleep(sleepMs)
  }

  const result = parsePages(htmls, baseUrl)

  return result
}
