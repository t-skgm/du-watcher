import { afterEach, beforeEach, describe, expect, test, setSystemTime } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parsePages } from './parsePages'

const BASE_URL = 'https://base-url.example'

const readSample = (name: string) =>
  readFileSync(resolve(__dirname, `./samples/${name}.snapshot.html`), { encoding: 'utf-8' })

describe('parsePages()', () => {
  beforeEach(() => {
    setSystemTime(new Date('2112-07-03T00:00:00+09:00'))
  })

  afterEach(() => {
    setSystemTime()
  })

  describe('中古一覧 (/used/punk/new_release)', () => {
    const html = readSample('used-punk-record')

    test('件数', () => {
      expect(parsePages([html], BASE_URL)).toHaveLength(60)
    })

    test('1件目', () => {
      const [item] = parsePages([html], BASE_URL)
      expect(item).toEqual({
        itemId: '1001069336',
        artist: 'DESMOND DEKKER / デスモンド・デッカー',
        productTitle: 'ORIGINAL REGGAE HITSOUND OF',
        labelName: 'TROJAN',
        genre: 'レゲエ',
        cheapestItemPrice: '1,900円(税込)',
        cheapestItemStatus: 'B',
        media: 'LP(レコード)',
        isDiscountedPrice: false,
        discountRatePercentage: undefined,
        itemPageUrl: `${BASE_URL}/used/detail/1001069336`,
        crawledAt: new Date('2112-07-03T00:00:00+09:00')
      })
    })

    test('全件で必須項目が取れている', () => {
      for (const item of parsePages([html], BASE_URL)) {
        expect(item.itemId).toMatch(/^\d+$/)
        expect(item.itemPageUrl).toStartWith(`${BASE_URL}/used/detail/`)
        expect(item.artist).toBeString()
        expect(item.productTitle).toBeString()
        expect(item.cheapestItemPrice).toMatch(/^[\d,]+円\(税込\)$/)
        expect(item.cheapestItemStatus).toMatch(/^(S|A|B\+|B|C)$/)
        expect(item.media).toBeString()
      }
    })

    test('レーベルがない商品は undefined', () => {
      const items = parsePages([html], BASE_URL)
      expect(items.filter(i => i.labelName == null).length).toBeGreaterThan(0)
    })

    test('最初の3件 (snapshot)', () => {
      expect(parsePages([html], BASE_URL).slice(0, 3)).toMatchSnapshot()
    })
  })

  describe('アウトレット一覧 (/punk/outlet)', () => {
    const html = readSample('outlet-punk-record')

    test('件数', () => {
      expect(parsePages([html], BASE_URL)).toHaveLength(60)
    })

    test('全件で割引情報が取れている', () => {
      for (const item of parsePages([html], BASE_URL)) {
        // 新品一覧のリンクは絶対URLなのでそのまま使う
        expect(item.itemPageUrl).toMatch(/^https:\/\/diskunion\.net\/detail\/\d+$/)
        expect(item.isDiscountedPrice).toBe(true)
        expect(item.discountRatePercentage).toMatch(/^\d+$/)
        expect(item.cheapestItemPrice).toMatch(/^[\d,]+円\(税込\)$/)
        expect(item.labelName).toBeString()
      }
    })

    test('中古の方が安い場合は中古価格と盤質を採用する', () => {
      // 新品(アウトレット) ¥4,620 / 中古 ¥3,950 (盤質 S)
      const item = parsePages([html], BASE_URL).find(i => i.itemId === '1009214433')
      expect(item).toMatchObject({
        cheapestItemPrice: '3,950円(税込)',
        cheapestItemStatus: 'S',
        isDiscountedPrice: true,
        discountRatePercentage: '30'
      })
    })

    test('割引が金額表示 (¥5,700 OFF) の場合は元値から割引率を算出する', () => {
      // ¥9,900 -> ¥4,200
      const item = parsePages([html], BASE_URL).find(i => i.itemId === '1009127567')
      expect(item).toMatchObject({
        cheapestItemPrice: '4,200円(税込)',
        isDiscountedPrice: true,
        discountRatePercentage: '58'
      })
    })

    test('中古がない場合はアウトレット価格を採用する', () => {
      const lastPage = readSample('outlet-punk-record-last')
      const item = parsePages([lastPage], BASE_URL).find(i => i.itemId === '1008971724')
      expect(item).toMatchObject({
        cheapestItemPrice: '4,048円(税込)',
        cheapestItemStatus: 'アウトレット',
        isDiscountedPrice: true,
        discountRatePercentage: '20'
      })
    })

    test('最初の3件 (snapshot)', () => {
      expect(parsePages([html], BASE_URL).slice(0, 3)).toMatchSnapshot()
    })
  })

  test('複数ページをまとめてパースできる', () => {
    const htmls = [readSample('outlet-punk-record'), readSample('outlet-punk-record-last')]
    expect(parsePages(htmls, BASE_URL)).toHaveLength(66)
  })

  test('商品がないHTMLは空配列', () => {
    expect(parsePages(['<html><body></body></html>'], BASE_URL)).toEqual([])
  })
})
