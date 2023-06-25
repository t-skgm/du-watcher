import { crawlHTML } from '@/lib/crawl'
import { parseDu } from '@/lib/parser/parseDu'

export const crawlDu = async ({ targetUrl }: { targetUrl: string }) => {
  const htmlString = await crawlHTML({ targetUrl })
  const result = parseDu(htmlString)
  return result
}
