import { type Selectable } from 'kysely'

export type ItemTable = {
  itemPageUrl: string

  artist: string
  productTitle: string
  url: string
  labelName: string | null
  genre: string
  cheapestItemPrice: number
  cheapestItemStatus: string
  isDiscountedPrice: boolean
  discountRatePercentage: number
  media: string
  itemId: string
  crawledAt: Date
  createdAt: Date
  updatedAt: Date

  pageId: string
}

export type Item = Selectable<ItemTable>
