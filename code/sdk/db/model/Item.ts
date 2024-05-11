import { type Selectable } from 'kysely'

export type ItemTable = {
  itemPageUrl: string

  artist: string
  productTitle: string
  labelName: string | null
  genre: string
  cheapestItemPrice: number
  cheapestItemStatus: string
  isDiscountedPrice: boolean
  discountRatePercentage: string
  media: string
  itemId: string
  crawledAt: Date
  createdAt: Date
  updatedAt: Date

  pageId: string
}

export type Page = Selectable<ItemTable>
