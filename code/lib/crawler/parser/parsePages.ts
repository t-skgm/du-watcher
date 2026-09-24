import { parsePriceStr } from '@/utils/formatPrice'
import { HTMLElement, parse } from 'node-html-parser'

/**
 * 商品一覧ページのHTMLをパースする
 * - 中古一覧 (`/used/{genre}/new_release`): `li.used-wide-product-item`
 * - 新品・アウトレット一覧 (`/{genre}/outlet` 等): `li.wide-product-item`
 */
export const parsePages = (htmls: string[], baseUrl: string): UsedItem[] =>
  htmls.flatMap(html =>
    parse(html)
      .querySelectorAll('li.used-wide-product-item, li.wide-product-item')
      .map(item => parseItem(item, baseUrl))
  )

const parseItem = (item: HTMLElement, baseUrl: string): UsedItem => {
  const href = item.querySelector('.product-name a')?.getAttribute('href')
  const itemPageUrl = href ? new URL(href, baseUrl).toString() : undefined

  const isUsedItem = item.classList.contains('used-wide-product-item')
  const cheapest = isUsedItem ? pickUsedItemOffer(item) : pickCheapestOffer(item)

  return {
    itemId: ItemIdRegexp.exec(href ?? '')?.[1],
    artist: textOf(item.querySelector('.product-artist')),
    productTitle: textOf(item.querySelector('.product-name a')),
    labelName: textOf(item.querySelector('.produt-sell-infos a[href*="/label/"]')),
    genre: textOf(item.querySelector('.product-category')),
    cheapestItemPrice: cheapest.price != null ? formatters.numberToPrice(cheapest.price) : undefined,
    cheapestItemStatus: cheapest.status,
    media: pickMedia(item.querySelector('.produt-sell-infos li')),
    isDiscountedPrice: item.querySelector('.after-price-off-container') != null,
    discountRatePercentage: pickDiscountRate(item),
    itemPageUrl,
    crawledAt: new Date()
  }
}

type Offer = { price: number | undefined; status: string | undefined }

/** 中古一覧の商品: 中古価格と盤質 */
const pickUsedItemOffer = (item: HTMLElement): Offer => ({
  price: priceOf(item.querySelector('.product-action-area .price')),
  status: textOf(item.querySelector('.product-conditoin-rank .rank-alpha'))
})

/** 新品一覧の商品: 新品価格と「中古 ¥X より」のうち安い方 */
const pickCheapestOffer = (item: HTMLElement): Offer => {
  const newOffer: Offer = {
    price: priceOf(item.querySelector('.after-price-off-container') ?? item.querySelector('.product-price-contena')),
    status: textOf(item.querySelector('.outlet-label')) ?? textOf(item.querySelector('.product-status-label'))
  }
  const usedInfo = item.querySelector('.product-old-and-rank-infos')
  const usedOffer: Offer = {
    price: priceOf(usedInfo?.querySelector('.old-price') ?? null),
    status: textOf(usedInfo?.querySelector('.rank-alpha') ?? null)
  }

  if (usedOffer.price == null) return newOffer
  if (newOffer.price == null) return usedOffer
  return usedOffer.price < newOffer.price ? usedOffer : newOffer
}

const priceOf = (el: HTMLElement | null) => (el ? parsePriceStr(el.text) : undefined)

/**
 * 割引率 (%)
 * 表示は "30%OFF" のほか "¥5,700 OFF" (金額) の場合があるので、後者は元値と割引後価格から算出する
 */
const pickDiscountRate = (item: HTMLElement): string | undefined => {
  const label = textOf(item.querySelector('.price-off .text-danger'))
  const rate = label?.match(/^(\d+)%OFF$/)?.[1]
  if (rate) return rate

  const origin = priceOf(item.querySelector('.price-off .origin-price'))
  const discounted = priceOf(item.querySelector('.after-price-off-container'))
  if (!origin || discounted == null) return undefined
  return String(Math.round(((origin - discounted) / origin) * 100))
}

/**
 * 販売情報からフォーマットを取り出す
 * ex. "[LABEL] / IMPORT / LP(レコード) / CATNO / 1008187327 / 2020年10月16日" -> "LP(レコード)"
 * レーベル名に " / " を含むことがあるため、レーベルのリンクを除去してから分割する
 */
const pickMedia = (sellInfo: HTMLElement | null) => {
  if (!sellInfo) return undefined
  const cloned = sellInfo.clone() as HTMLElement
  cloned.querySelectorAll('a[href*="/label/"]').forEach(a => a.remove())
  const segments = cloned.text
    // 区切りの前後に改行が入ることがあるため、空白をまとめてから分割する
    .replace(/\s+/g, ' ')
    .split(' / ')
    .map(s => s.trim())
    .filter(s => s !== '')
  // segments[0] は IMPORT / JPN などの輸入区分
  return segments[1]
}

const textOf = (el: HTMLElement | null) => {
  const text = el?.text.replace(/\s+/g, ' ').trim()
  return text ? text : undefined
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

const ItemIdRegexp = /detail\/(\d+)/

const formatters = {
  // ex. 1000 -> 1,000円(税込)
  numberToPrice: (priceNum: number) => `${priceNum.toLocaleString()}円(税込)`
}
