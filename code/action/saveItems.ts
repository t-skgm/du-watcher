import type { UsedItem } from '@/lib/crawler/parser/parsePages'
import type { DB } from '@/sdk/db/createDB'
import type { ItemTable } from '@/sdk/db/model/Item'
import { sleep } from 'bun'
import type { Updateable } from 'kysely'
import { omitBy } from 'remeda'

export const saveItemsAction =
  ({ db }: { db: DB }) =>
  async ({ items, pageId }: { items: UsedItem[]; pageId: string }) => {
    const upsertItem = async (item: UsedItem) => {
      if (item.itemId == null) return

      const existItem = await db
        .selectFrom('items')
        .select('itemId')
        .where('itemId', '=', item.itemId)
        .executeTakeFirst()

      if (existItem != null) {
        console.log('[saveItems] update! item:', item.itemId)
        const updateArg: Updateable<ItemTable> = omitBy(
          {
            artist: item.artist,
            productTitle: item.productTitle,
            url: item.itemPageUrl,
            labelName: item.labelName,
            isDiscountedPrice: item.isDiscountedPrice,
            discountRatePercentage: item.discountRatePercentage ? Number(item.discountRatePercentage) : undefined,
            cheapestItemPrice: item.cheapestItemPrice ? Number(item.cheapestItemPrice) : undefined,
            cheapestItemStatus: item.cheapestItemStatus,
            media: item.media,
            genre: item.genre,
            crawledAt: item.crawledAt
          },
          // omit keys which have empty value
          val => val == null || val == undefined || val == ''
        )
        // update
        await db.updateTable('items').set(updateArg).where('itemId', '=', item.itemId).execute()
      } else {
        console.log('[saveItems] insert! item:', item.itemId)
        // insert
        await db
          .insertInto('items')
          .values({
            itemPageUrl: item.itemPageUrl!,
            artist: item.artist ?? '(unknown)',
            productTitle: item.productTitle ?? '(unknown)',
            url: item.itemPageUrl ?? '',
            labelName: item.labelName,
            isDiscountedPrice: item.isDiscountedPrice,
            discountRatePercentage: item.discountRatePercentage ? Number(item.discountRatePercentage) : 0,
            cheapestItemPrice: item.cheapestItemPrice ? Number(item.cheapestItemPrice) : 0,
            cheapestItemStatus: item.cheapestItemStatus ?? '',
            media: item.media ?? '',
            genre: item.genre ?? '',
            itemId: item.itemId,
            crawledAt: item.crawledAt,
            createdAt: new Date(),
            updatedAt: new Date(),
            pageId
          })
          .execute()
      }
    }

    for (const item of items) {
      await upsertItem(item).catch((e: Error) => {
        console.error('[saveItems] error, but continue', e)
      })
      await sleep(5)
    }
  }
