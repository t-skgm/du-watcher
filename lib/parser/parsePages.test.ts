import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { UsedItem, parsePages } from './parsePages'

describe('parsePages()', () => {
  beforeEach(() => {
    const date = new Date('2112-07-03T00:00:00+09:00')
    vi.useFakeTimers().setSystemTime(date)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('normal', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-normal.snapshot.html'), { encoding: 'utf-8' })
    test('件数', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')

      expect(result).length(50)
    })

    test('最初の3件', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "artist": "BEN WATT",
          "cheapestItemPrice": "2,250円(税込)",
          "cheapestItemStatus": "B",
          "crawledAt": 2112-07-02T15:00:00.000Z,
          "discountRatePercentage": undefined,
          "genre": "ROCK / POPS / INDIE",
          "isDiscountedPrice": false,
          "itemId": "1007488350",
          "itemPageUrl": "https://base-url.exmaple/used/ct/indiealt/udetail/1007488350",
          "labelName": "CHERRY RED",
          "media": "12\\"(レコード)",
          "productTitle": "SUMMER INTO WINTER",
        }
      `)
      expect(result[1]).toMatchInlineSnapshot(`
        {
          "artist": "2ND GRADE",
          "cheapestItemPrice": "2,035円(税込)",
          "cheapestItemStatus": "S",
          "crawledAt": 2112-07-02T15:00:00.000Z,
          "discountRatePercentage": "50",
          "genre": "ROCK / POPS / INDIE",
          "isDiscountedPrice": true,
          "itemId": "1008552801",
          "itemPageUrl": "https://base-url.exmaple/used/ct/indiealt/udetail/1008552801",
          "labelName": "DOUBLE DOUBLE WHAMMY",
          "media": "LP(レコード)",
          "productTitle": "EASY LISTENING (VINYL)",
        }
      `)
      expect(result[2]).toMatchInlineSnapshot(`
        {
          "artist": "ALEX G アレックス・G",
          "cheapestItemPrice": "2,695円(税込)",
          "cheapestItemStatus": "B",
          "crawledAt": 2112-07-02T15:00:00.000Z,
          "discountRatePercentage": "30",
          "genre": "ROCK / POPS / INDIE",
          "isDiscountedPrice": true,
          "itemId": "1008448920",
          "itemPageUrl": "https://base-url.exmaple/used/ct/indiealt/udetail/1008448920",
          "labelName": "LUCKY NUMBER",
          "media": "LP(レコード)",
          "productTitle": "RULES (LP+7\\")",
        }
      `)
    })
  })

  describe('discounted', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-discount.snapshot.html'), {
      encoding: 'utf-8'
    })
    test('件数', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')

      expect(result).length(50)
    })

    test('最初の3件', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "artist": "A'S (INDIE)",
          "cheapestItemPrice": "1,709円(税込)",
          "cheapestItemStatus": "B",
          "crawledAt": 2112-07-02T15:00:00.000Z,
          "discountRatePercentage": "5",
          "genre": "ROCK / POPS / INDIE",
          "isDiscountedPrice": true,
          "itemId": "1008509505",
          "itemPageUrl": "https://base-url.exmaplehttps://diskunion.net/used/ct/indiealt/udetail/1008509505",
          "labelName": "PSYCHIC HOTLINE",
          "media": "LP(レコード)",
          "productTitle": "FRUIT (BLACK VINYL)",
        }
      `)
      expect(result[1]).toMatchInlineSnapshot(`
        {
          "artist": "ALEX CALDER",
          "cheapestItemPrice": "1,045円(税込)",
          "cheapestItemStatus": "B",
          "crawledAt": 2112-07-02T15:00:00.000Z,
          "discountRatePercentage": "5",
          "genre": "ROCK / POPS / INDIE",
          "isDiscountedPrice": true,
          "itemId": "AWS150123-AC1",
          "itemPageUrl": "https://base-url.exmaplehttps://diskunion.net/used/ct/indiealt/udetail/AWS150123-AC1",
          "labelName": "CAPTURED TRACKS",
          "media": "LP(レコード)",
          "productTitle": "STRANGE DREAMS (LP)",
        }
      `)
      expect(result[2]).toMatchInlineSnapshot(`
        {
          "artist": "ALEX G アレックス・G",
          "cheapestItemPrice": "2,232円(税込)",
          "cheapestItemStatus": "S",
          "crawledAt": 2112-07-02T15:00:00.000Z,
          "discountRatePercentage": "5",
          "genre": "ROCK / POPS / INDIE",
          "isDiscountedPrice": true,
          "itemId": "1008448920",
          "itemPageUrl": "https://base-url.exmaplehttps://diskunion.net/used/ct/indiealt/udetail/1008448920",
          "labelName": "LUCKY NUMBER",
          "media": "LP(レコード)",
          "productTitle": "RULES (LP+7\\")",
        }
      `)
    })
  })
})
