import { parse } from 'node-html-parser'

export const parsePages = (htmls: string[], baseUrl: string): UsedItem[] => {
  const results: UsedItem[] = []

  htmls.forEach(html => {
    const doc = parse(html)
    const resultList = doc.querySelectorAll('.subGenreResult > .subGenreResult__li')

    resultList.forEach(item => {
      const artist = item.querySelector('h3.subGenreResult__artist a')?.textContent.trim()
      const productTitle = item.querySelector('h2.subGenreResult__name a')?.textContent.trim()
      const labelName = item.querySelector('p.subGenreResult__other a')?.textContent.trim()

      const isDiscountedPrice = item.querySelector('.u-priceDiscount') != null
      const discountRatePercentage = formatters.pickDiscountedRate(
        item.querySelector('.u-discountRate')?.textContent.trim()
      )

      const cheapestItemPrice = isDiscountedPrice
        ? formatters.cutOffText(item.querySelector('p.u-priceDiscount')?.textContent.trim())
        : item.querySelector('p.u-priceNormal--Blue')?.textContent.trim()

      const cheapestItemStatus = item.querySelector('figure.subGenreResult__thumb > span > span')?.textContent.trim()

      const genre = item.querySelector('p.subGenreResult__tag')?.textContent.trim()
      const itemPageUrl = item.querySelector('h2.subGenreResult__name a')?.getAttribute('href')
      const itemId = ItemIdRegexp.exec(itemPageUrl ?? '')?.[1]
      const media = formatters.pickMediaText(item.querySelector('.subGenreResult__other')?.textContent)

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
        itemPageUrl: itemPageUrl && `${baseUrl}${itemPageUrl}`,
        crawledAt: new Date()
      })
    })
  })

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

const ItemIdRegexp = /udetail\/(.*)/

const formatters = {
  // X%OFF -> X
  pickDiscountedRate: (text: string | undefined) => text?.replace(/(\d+)%OFF$/, '$1'),
  cutOffText: (text: string | undefined) => text?.replace(/^\d+%OFF\s*/, ''),
  pickMediaText: (text: string | undefined) => text?.split(' / ')[2].trim()
}
