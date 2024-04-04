import { afterEach, beforeEach, describe, expect, test, setSystemTime } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parsePages } from './parsePages'

describe('parsePages()', () => {
  beforeEach(() => {
    const date = new Date('2112-07-03T00:00:00+09:00')
    setSystemTime(date)
  })

  afterEach(() => {
    setSystemTime()
  })

  describe('genre: normal', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-genre-normal.snapshot.html'), {
      encoding: 'utf-8'
    })
    test('件数', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')

      expect(result).toHaveLength(50)
    })

    test('最初の3件', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')
      expect(result[0]).toMatchSnapshot()
      expect(result[1]).toMatchSnapshot()
      expect(result[2]).toMatchSnapshot()
    })
  })

  describe('genre: discounted', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-genre-discount.snapshot.html'), {
      encoding: 'utf-8'
    })
    test('件数', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')

      expect(result).toHaveLength(50)
    })

    test('最初の3件', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')
      expect(result[0]).toMatchSnapshot()
      expect(result[1]).toMatchSnapshot()
      expect(result[2]).toMatchSnapshot()
    })
  })

  describe('all: discounted', () => {
    const snapshotHtml = readFileSync(resolve(__dirname, './samples/list-all-discount.snapshot.html'), {
      encoding: 'utf-8'
    })
    test('件数', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')

      expect(result).toHaveLength(50)
    })

    test('最初の3件', async () => {
      const result = parsePages([snapshotHtml], 'https://base-url.exmaple')
      expect(result[0]).toMatchSnapshot()
      expect(result[1]).toMatchSnapshot()
      expect(result[2]).toMatchSnapshot()
    })
  })
})
