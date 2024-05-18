import type { UsedItem } from '@/lib/crawler/parser/parsePages'
import type { DB } from '@/sdk/db/createDB'
import type { ItemTable } from '@/sdk/db/model/Item'
import { sleep } from 'bun'
import type { Updateable } from 'kysely'
import { ResultAsync } from 'neverthrow'
import { omitBy } from 'remeda'

export const saveItemsAction = ({ db }: { db: DB }) =>
  ResultAsync.fromThrowable(
    async ({ items, pageId }: { items: UsedItem[]; pageId: string }) => {
      const _upsertItem = async (item: UsedItem) => {
        if (item.itemId == null) return

        const existItem = await db
          .selectFrom('items')
          .select('itemId')
          .where('itemId', '=', item.itemId)
          .executeTakeFirst()

        if (existItem != null) {
          console.log('[saveItems] update! item:', item)
          const updateArg: Updateable<ItemTable> = omitBy(
            {
              artist: item.artist,
              productTitle: item.productTitle,
              itemPageUrl: item.itemPageUrl,
              labelName: item.labelName,
              isDiscountedPrice: item.isDiscountedPrice,
              discountRatePercentage: item.discountRatePercentage ? Number(item.discountRatePercentage) : undefined,
              cheapestItemPrice:
                item.cheapestItemPrice != null && item.cheapestItemPrice !== ''
                  ? Number(removePriceUnit(item.cheapestItemPrice))
                  : undefined,
              cheapestItemStatus: item.cheapestItemStatus,
              media: item.media,
              genre: item.genre,
              crawledAt: item.crawledAt.toISOString()
            },
            // omit keys which have empty value
            val => val == null || val == undefined || val == ''
          )

          // update
          await db.updateTable('items').set(updateArg).where('itemId', '=', item.itemId).execute()
        } else {
          console.log('[saveItems] insert! item:', item)

          // insert
          await db
            .insertInto('items')
            .values({
              itemPageUrl: item.itemPageUrl!,
              artist: item.artist ?? '(unknown)',
              productTitle: item.productTitle ?? '(unknown)',
              labelName: item.labelName,
              isDiscountedPrice: item.isDiscountedPrice,
              discountRatePercentage: item.discountRatePercentage ? Number(item.discountRatePercentage) : 0,
              cheapestItemPrice:
                item.cheapestItemPrice != null && item.cheapestItemPrice !== ''
                  ? Number(removePriceUnit(item.cheapestItemPrice))
                  : 0,
              cheapestItemStatus: item.cheapestItemStatus ?? '',
              media: item.media ?? '',
              genre: item.genre ?? '',
              itemId: item.itemId,
              crawledAt: item.crawledAt.toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              pageId
            })
            .execute()
        }
      }

      for (const item of items) {
        await _upsertItem(item)
        await sleep(5)
      }
    },
    err => err as Error
  )

/** "1,709円(税込)" の書式から 1709 を得る */
const removePriceUnit = (priceStr: string): string => priceStr.split('円')[0].replace(/,/g, '')
