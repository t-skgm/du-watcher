import { sleep } from '@/lib/utils'
import { prisma } from '../lib/prisma'
import { parsePriceStr } from '@/lib/formatPrice'

const log = console.log

const run = async () => {
  log(`[script] connect`)
  await prisma.$connect()

  log(`[script] query existing items`)
  const items = await prisma.items.findMany({
    where: { cheapestItemPriceYen: 0 }
  })

  log(`[script] ${items.length} items`)

  let cnt = 0
  for (const item of items) {
    if (cnt % 10 === 1) log(`[script] item #${cnt}`)

    const formattedCheapestPrice = parsePriceStr(item.cheapestItemPrice)

    if (formattedCheapestPrice != null) {
      await prisma.items.update({
        where: { itemId: item.itemId },
        data: {
          cheapestItemPriceYen: formattedCheapestPrice
        }
      })
    }

    await sleep(10)
    cnt += 1
  }

  log(`[script] finished!`)
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
