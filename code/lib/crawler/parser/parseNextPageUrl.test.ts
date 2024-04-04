import { beforeAll, describe, expect, test } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseNextPageUrl } from './parseNextPageUrl'

describe('parseNextPageUrl()', () => {
  describe('genre: normal', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-genre-normal.snapshot.html'), {
      encoding: 'utf-8'
    })

    let result: string | undefined

    beforeAll(() => {
      result = parseNextPageUrl(snapshotHtml, 'https://base-url.exmaple')
    })

    test('正しい', async () => {
      expect(result).toEqual('https://base-url.exmaple/used/ct/indiealt/new_ulist/0/637/0/0/0103103162/2/50/2')
    })
  })

  describe('all: discount', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-all-discount.snapshot.html'), {
      encoding: 'utf-8'
    })

    let result: string | undefined

    beforeAll(() => {
      result = parseNextPageUrl(snapshotHtml, 'https://base-url.exmaple')
    })

    test('正しい', async () => {
      expect(result).toEqual('https://base-url.exmaple/indiealt/ct/sale/0/0/0/010203106209/0/0/50/0/0/0/0/0/2')
    })
  })
})
