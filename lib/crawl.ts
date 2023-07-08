import { fetchHTML } from './fetchHTML'
import { parseNextPageUrl } from './parser/parseNextPageUrl'
import { parsePages } from './parser/parsePages'
import { sleep } from './utils'

/** crawl (with sleeping) */
export const crawl = async ({ targetUrl, sleepMs = 300 }: { targetUrl: string; sleepMs?: number }) => {
  const htmls: string[] = []
  let nextPageUrl: string | undefined = targetUrl

  // fetch with pagenate
  while (nextPageUrl != null) {
    const firstHtml = await fetchHTML({ url: nextPageUrl })
    nextPageUrl = parseNextPageUrl(firstHtml)
    htmls.push(firstHtml)
    sleep(sleepMs)
  }

  const result = parsePages(htmls)

  return result
}
