import { PrismaClient } from '@prisma/client'
import { crawl } from '../lib/crawl'
import { saveItems } from '../lib/saveItems'

const log = console.log

const prisma = new PrismaClient()

const run = async () => {
  await prisma.$connect()

  const pages = await prisma.pages.findMany({
    where: { status: 'ACTIVE' }
  })

  log(`[crawl] crawl starting: ${pages.length} pages`)

  let pageCount = 1
  for (const page of pages) {
    log(`[crawl] crawl #${pageCount}/${pages.length}, name: ${page.name}, url: ${page.url}`)
    const items = await crawl({ targetUrl: page.url })
    log(`[crawl] crawl success`)

    log(`[crawl] save items... size: ${items.length}`)
    await saveItems({ items, pageId: page.id })

    pageCount++
  }

  log(`[crawl] all crawl finished! page size: ${pageCount}`)
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
