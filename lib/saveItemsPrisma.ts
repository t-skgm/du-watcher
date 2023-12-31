import { parsePriceStr } from './formatPrice'
import { UsedItem } from './parser/parsePages'
import type { PrismaClient } from '@prisma/client'

export const saveItems = async (prisma: PrismaClient, { items, pageId }: { items: UsedItem[]; pageId: number }) => {
  const upsertCommands = items.map(i =>
    prisma.items.upsert({
      where: { itemId: i.itemId! },
      create: {
        itemId: i.itemId!,
        itemPageUrl: i.itemPageUrl ?? '',
        artist: i.artist ?? '',
        productTitle: i.productTitle ?? '',
        genre: i.genre ?? '',
        labelName: i.labelName ?? '',
        cheapestItemPrice: i.cheapestItemPrice ?? '',
        cheapestItemPriceYen: i.cheapestItemPrice != null ? parsePriceStr(i.cheapestItemPrice) : undefined,
        cheapestItemStatus: i.cheapestItemStatus ?? '',
        crawledAt: i.crawledAt,
        pages: { create: { page: { connect: { id: Number(pageId) } } } }
      },
      update: {
        itemPageUrl: i.itemPageUrl ?? undefined,
        artist: i.artist ?? undefined,
        productTitle: i.productTitle ?? undefined,
        genre: i.genre ?? undefined,
        labelName: i.labelName ?? undefined,
        cheapestItemPrice: i.cheapestItemPrice ?? undefined,
        cheapestItemPriceYen: i.cheapestItemPrice != null ? parsePriceStr(i.cheapestItemPrice) : undefined,
        cheapestItemStatus: i.cheapestItemStatus ?? undefined,
        crawledAt: i.crawledAt
      }
    })
  )
  await prisma.$transaction(upsertCommands)
}
