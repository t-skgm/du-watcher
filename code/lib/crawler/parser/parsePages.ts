import { parsePriceStr } from '@/utils/formatPrice'
import { HTMLElement, parse } from 'node-html-parser'

export const parsePages = (htmls: string[], baseUrl: string): UsedItem[] => {
  const results: UsedItem[] = []

  for (const html of htmls) {
    const doc = parse(html)
    const subGenreList = doc.querySelectorAll('.subGenreResult > .subGenreResult__li')

    if (subGenreList.length > 0) {
      results.push(...parseSubGenreResults(subGenreList, baseUrl))
    } else {
      const searchList = doc.querySelectorAll('.subGenreResult > .searchAll__li')
      results.push(...parseSearchResults(searchList, baseUrl))
    }
  }

  return results
}

const parseSubGenreResults = (resultList: HTMLElement[], baseUrl: string) => {
  const results: UsedItem[] = []

  for (const item of resultList) {
    const artist = item.querySelector('h3.subGenreResult__artist a')?.textContent?.trim()
    const productTitle = item.querySelector('h2.subGenreResult__name a')?.textContent?.trim()
    const labelName = item.querySelector('p.subGenreResult__other a')?.textContent?.trim()

    const isDiscountedPrice = item.querySelector('.u-priceDiscount') != null
    const discountRatePercentage = formatters.pickDiscountedRate(
      item.querySelector('.u-discountRate')?.textContent?.trim()
    )

    const cheapestItemPrice = isDiscountedPrice
      ? formatters.cutOffText(item.querySelector('p.u-priceDiscount')?.textContent?.trim())
      : item.querySelector('p.u-priceNormal--Blue')?.textContent?.trim()

    const cheapestItemStatus = item.querySelector('figure.subGenreResult__thumb > span > span')?.textContent?.trim()

    const genre = item.querySelector('p.subGenreResult__tag')?.textContent?.trim()
    const itemPageUrl = item.querySelector('h2.subGenreResult__name a')?.getAttribute('href')
    const itemId = ItemIdRegexp.exec(itemPageUrl ?? '')?.[1]
    const media = formatters.pickMediaText(item.querySelector('.subGenreResult__other')?.textContent ?? '')

    results.push({
      itemId,
      artist,
      productTitle,
      labelName,
      genre,
      cheapestItemPrice,
      cheapestItemStatus,
      media,
      isDiscountedPrice,
      discountRatePercentage,
      itemPageUrl: itemPageUrl ? `${baseUrl}${itemPageUrl}` : undefined,
      crawledAt: new Date()
    })
  }

  return results
}

const parseSearchResults = (resultList: HTMLElement[], baseUrl: string) => {
  const results: UsedItem[] = []

  for (const item of resultList) {
    const artist = item.querySelector('h2.searchAll__artist a')?.textContent?.trim()
    const productTitle = item.querySelector('h2.searchAll__name a')?.textContent?.replace(/\s+/g, ' ')?.trim()
    const labelName = item.querySelector('p.searchAll__other a')?.textContent?.trim()

    const isDiscountedPrice = item.querySelector('.u-priceDiscount') != null
    const discountRatePercentage = formatters.pickDiscountedRate(
      item.querySelector('.u-discountRate')?.textContent?.trim()
    )
    const normalItemPrice = isDiscountedPrice
      ? getPriceString(item.querySelector('p.u-priceDiscount'))
      : getPriceString(item.querySelector('p.u-priceNormal--Blue'))
    const normalItemStatus = item.querySelector('.tag-menbersSale')?.textContent?.trim()

    const subGenreUsedPrice = getPriceString(item.querySelector('.priceUsed__price'))
    // 最初のStatus
    const subGenreUsedStatus = item.querySelector('.qualityArea__li')?.textContent?.trim()

    const isNormalItemCheapest = normalItemPrice < subGenreUsedPrice
    const cheapestItemPrice = formatters.numberToPrice(isNormalItemCheapest ? normalItemPrice : subGenreUsedPrice)
    const cheapestItemStatus = isNormalItemCheapest ? normalItemStatus : subGenreUsedStatus

    const genre = item.querySelector('p.searchAll__tag')?.textContent?.trim()
    const itemPageUrl = item.querySelector('h2.searchAll__name a')?.getAttribute('href')
    const itemId = ItemIdRegexp.exec(itemPageUrl ?? '')?.[1]
    const media = formatters.pickMediaText(item.querySelector('.searchAll__other')?.textContent ?? '')

    results.push({
      itemId,
      artist,
      productTitle,
      labelName,
      genre,
      cheapestItemPrice,
      cheapestItemStatus,
      media,
      isDiscountedPrice,
      discountRatePercentage,
      itemPageUrl: itemPageUrl ? `${baseUrl}${itemPageUrl}` : undefined,
      crawledAt: new Date()
    })
  }

  return results
}

export type UsedItem = {
  artist: string | undefined
  productTitle: string | undefined
  labelName: string | undefined
  genre: string | undefined
  cheapestItemPrice: string | undefined
  cheapestItemStatus: string | undefined
  isDiscountedPrice: boolean
  discountRatePercentage: string | undefined
  media: string | undefined
  itemPageUrl: string | undefined
  itemId: string | undefined
  crawledAt: Date
}

const ItemIdRegexp = /detail\/(.*)/

const formatters = {
  // X%OFF -> X
  pickDiscountedRate: (text: string | undefined) => text?.replace(/(\d+)%OFF$/, '$1'),
  cutOffText: (text: string | undefined) => text?.replace(/^\d+%OFF\s*/, ''),
  pickMediaText: (text: string | undefined) => text?.replace(/\s+/g, ' ')?.split(' / ')[2].trim(),
  // ex. 1000 -> 1,000円
  numberToPrice: (priceNum: number) => `${priceNum.toLocaleString()}円(税込)`
}

const getPriceString = (priceNode: HTMLElement | null): number => {
  if (!priceNode) return Number.MAX_SAFE_INTEGER
  priceNode.querySelectorAll('span').forEach(span => span.remove())
  return parsePriceStr(priceNode.textContent.trim()) ?? Number.MAX_SAFE_INTEGER
}
