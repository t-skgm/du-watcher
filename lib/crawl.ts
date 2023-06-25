import { fetchHTML } from './fetchHTML'
import { parseNextPageUrl } from './parser/parseNextPageUrl'
import { parsePages } from './parser/parsePages'
import { sleep } from './utils'

export const crawl = async ({ targetUrl }: { targetUrl: string }) => {
  const htmls: string[] = []
  let nextPageUrl: string | undefined = targetUrl

  // fetch with pagenate
  while (nextPageUrl != null) {
    const firstHtml = await fetchHTML({ url: nextPageUrl })
    nextPageUrl = parseNextPageUrl(firstHtml)
    htmls.push(firstHtml)
    sleep(300)
  }

  const result = parsePages(htmls)

  return result
}
