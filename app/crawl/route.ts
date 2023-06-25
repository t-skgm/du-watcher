import { NextResponse } from 'next/server'
import { crawl } from '@/lib/crawl'

export async function GET(request: Request) {
  const reqUrl = new URL(request.url)
  const targetUrl = reqUrl.searchParams.get('u')
  if (targetUrl == null) {
    return new Response('Invalid params', { status: 501 })
  }
  const res = await crawl({ targetUrl })
  console.log(res)

  return NextResponse.json({ message: 'ok!' })
}
