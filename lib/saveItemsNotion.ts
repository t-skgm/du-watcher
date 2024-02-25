import { Client } from '@notionhq/client'
import { UsedItem } from './parser/parsePages'
import { notionPages } from './notion'
import { parsePriceStr } from './formatPrice'
import { UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import { sleep } from './utils'

export const saveItems = async (notionClient: Client, { items, pageId }: { items: UsedItem[]; pageId: string }) => {
  const upsertItem = async (item: UsedItem) => {
    if (item.itemId == null) return

    const queryRes = await notionClient.databases.query({
      database_id: notionPages.itemsDbID,
      filter: {
        property: 'ItemID',
        title: { equals: item.itemId }
      }
    })
    const existItem = queryRes.results[0]

    if (existItem) {
      console.log('[saveItems] update! item:', item.itemId)
      const params: UpdatePageParameters = { page_id: existItem.id, properties: {} }
      // type guard
      if (params.properties) {
        if (item.itemId) params.properties.ItemID = { title: [{ text: { content: item.itemId } }] }
        if (item.artist) params.properties.Artist = { rich_text: [{ text: { content: item.artist } }] }
        if (item.productTitle)
          params.properties.Title = {
            rich_text: [{ text: { content: item.productTitle, link: { url: item.itemPageUrl ?? '' } } }]
          }
        if (item.labelName) params.properties.Label = { rich_text: [{ text: { content: item.labelName } }] }
        if (item.isDiscountedPrice != null) params.properties.Discounted = { checkbox: true }
        if (item.discountRatePercentage != null) {
          params.properties.DiscountRate = { number: parsePriceStr(item.discountRatePercentage) ?? 0 }
        }
        if (item.cheapestItemPrice != null)
          params.properties.CheapestPriceYen = { number: parsePriceStr(item.cheapestItemPrice) ?? 0 }
        if (item.cheapestItemStatus) params.properties.CheapestStatus = { select: { name: item.cheapestItemStatus } }
        if (item.media != null) params.properties.Media = { select: { name: item.media } }
        if (item.genre) params.properties.Genre = { select: { name: item.genre } }
        params.properties.Crawled = { date: { start: item.crawledAt.toISOString() } }
        if (item.itemPageUrl) params.properties.ItemPageURL = { url: item.itemPageUrl }
      }

      // update
      await notionClient.pages.update(params)
    } else {
      console.log('[saveItems] insert! item:', item.itemId)
      // insert
      await notionClient.pages.create({
        parent: { database_id: notionPages.itemsDbID },
        properties: {
          ItemPageURL: { url: item.itemPageUrl ?? null },
          Artist: { rich_text: [{ text: { content: item.artist ?? '' } }] },
          Title: { rich_text: [{ text: { content: item.productTitle ?? '', link: { url: item.itemPageUrl ?? '' } } }] },
          Label: { rich_text: [{ text: { content: item.labelName ?? '' } }] },
          Discounted: { checkbox: item.isDiscountedPrice },
          DiscountRate: { number: parsePriceStr(item.discountRatePercentage ?? '0') ?? 0 },
          CheapestPriceYen: { number: parsePriceStr(item.cheapestItemPrice ?? '0') ?? 0 },
          CheapestStatus: { select: { name: item.cheapestItemStatus ?? '' } },
          Media: { select: { name: item.media ?? '' } },
          Genre: { select: { name: item.genre ?? '' } },
          ItemID: { title: [{ text: { content: item.itemId ?? '' } }] },
          Crawled: { date: { start: item.crawledAt.toISOString() } },
          Page: { relation: [{ id: pageId }] }
        }
      })
    }
  }

  for (const item of items) {
    await upsertItem(item)
    await sleep(10)
  }
}
