import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { UsedItem, parsePages } from './parsePages'

const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-normal.snapshot.html'), { encoding: 'utf-8' })

describe('parsePages()', () => {
  beforeEach(() => {
    const date = new Date('2112-07-03T00:00:00+09:00')
    vi.useFakeTimers().setSystemTime(date)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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
        "genre": "ROCK / POPS / INDIE",
        "itemId": "1007488350",
        "itemPageUrl": "https://base-url.exmaple/used/ct/indiealt/udetail/1007488350",
        "labelName": "CHERRY RED",
        "productTitle": "SUMMER INTO WINTER",
      }
    `)
    expect(result[1]).toMatchInlineSnapshot(`
      {
        "artist": "2ND GRADE",
        "cheapestItemPrice": "2,250円(税込)",
        "cheapestItemStatus": "S",
        "crawledAt": 2112-07-02T15:00:00.000Z,
        "genre": "ROCK / POPS / INDIE",
        "itemId": "1008552801",
        "itemPageUrl": "https://base-url.exmaple/used/ct/indiealt/udetail/1008552801",
        "labelName": "DOUBLE DOUBLE WHAMMY",
        "productTitle": "EASY LISTENING (VINYL)",
      }
    `)
    expect(result[2]).toMatchInlineSnapshot(`
      {
        "artist": "ALEX G アレックス・G",
        "cheapestItemPrice": "2,550円(税込)",
        "cheapestItemStatus": "B",
        "crawledAt": 2112-07-02T15:00:00.000Z,
        "genre": "ROCK / POPS / INDIE",
        "itemId": "1008448920",
        "itemPageUrl": "https://base-url.exmaple/used/ct/indiealt/udetail/1008448920",
        "labelName": "LUCKY NUMBER",
        "productTitle": "RULES (LP+7\\")",
      }
    `)
  })
})
