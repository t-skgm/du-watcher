import { type ColumnType, type Selectable } from 'kysely'

export type ItemTable = {
  itemId: string
  itemPageUrl: string
  artist: string
  productTitle: string
  labelName: string | null
  genre: string
  cheapestItemPrice: number
  cheapestItemStatus: string
  isDiscountedPrice: boolean
  discountRatePercentage: number
  media: string
  crawledAt: ColumnType<string, string, string>
  createdAt: ColumnType<string, string | undefined, string>
  updatedAt: ColumnType<string, string | undefined, string>

  pageId: string
}

export type Item = Selectable<ItemTable>
