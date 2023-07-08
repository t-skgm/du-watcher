import { NextResponse } from 'next/server'
import { crawl } from '@/lib/crawl'
import { AppConfig } from 'next/dist/build/utils'
import { saveItems } from '@/lib/saveItems'

export const dynamic: AppConfig['dynamic'] = 'force-dynamic'

export async function GET(request: Request) {
  const reqUrl = new URL(request.url)
  const targetUrl = reqUrl.searchParams.get('u')
  const pageId = reqUrl.searchParams.get('page')
  if (targetUrl == null || pageId == null) {
    return new Response('Invalid params', { status: 400 })
  }

  console.log('[crawl] start crawling...')
  const items = await crawl({ targetUrl })

  console.log('[crawl] save items')
  await saveItems({ items, pageId: Number(pageId) })

  return NextResponse.json({ count: items.length })
}
