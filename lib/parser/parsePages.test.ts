import { beforeAll, describe, expect, test } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { UsedItem, parsePages } from './parsePages'

const snapshotHtml = readFileSync(resolve(__dirname, './test.snapshot.html'), { encoding: 'utf-8' })

describe('parsePages()', () => {
  let result: UsedItem[]

  beforeAll(() => {
    result = parsePages([snapshotHtml])
  })

  test('件数', async () => {
    expect(result).length(50)
  })

  test('最初の3件', async () => {
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "artist": "BEN WATT",
        "cheapestItemPrice": "2,250円(税込)",
        "cheapestItemStatus": "B",
        "genre": "ROCK / POPS / INDIE",
        "itemId": "1007488350",
        "itemPageUrl": "https://diskunion.net/used/ct/indiealt/udetail/1007488350",
        "labelName": "CHERRY RED",
        "productTitle": "SUMMER INTO WINTER",
      }
    `)
    expect(result[1]).toMatchInlineSnapshot(`
      {
        "artist": "2ND GRADE",
        "cheapestItemPrice": "2,250円(税込)",
        "cheapestItemStatus": "S",
        "genre": "ROCK / POPS / INDIE",
        "itemId": "1008552801",
        "itemPageUrl": "https://diskunion.net/used/ct/indiealt/udetail/1008552801",
        "labelName": "DOUBLE DOUBLE WHAMMY",
        "productTitle": "EASY LISTENING (VINYL)",
      }
    `)
    expect(result[2]).toMatchInlineSnapshot(`
      {
        "artist": "ALEX G アレックス・G",
        "cheapestItemPrice": "2,550円(税込)",
        "cheapestItemStatus": "B",
        "genre": "ROCK / POPS / INDIE",
        "itemId": "1008448920",
        "itemPageUrl": "https://diskunion.net/used/ct/indiealt/udetail/1008448920",
        "labelName": "LUCKY NUMBER",
        "productTitle": "RULES (LP+7\\")",
      }
    `)
  })
})
