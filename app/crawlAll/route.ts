import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : 'http://localhost:3000'

export async function GET(_request: Request) {
  console.log(`BASE: ${BASE_URL}`)
  const pages = await prisma.pages.findMany({
    where: { status: 'ACTIVE' }
  })

  // only calling, not waiting
  void Promise.all(
    pages.map(async page => {
      const pageUrl = `${BASE_URL}/crawl?p=${page.id}&u=${encodeURIComponent(page.url)}`
      console.log('[crawlAll] fetch', pageUrl)
      await fetch(pageUrl)
    })
  )

  return NextResponse.json({ message: 'Start to crawling...' })
}
