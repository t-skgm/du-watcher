import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { hasNextPage } from './hasNextPage'

const readSample = (name: string) =>
  readFileSync(resolve(__dirname, `./samples/${name}.snapshot.html`), { encoding: 'utf-8' })

describe('hasNextPage()', () => {
  test('1ページ目 (中古一覧)', () => {
    expect(hasNextPage(readSample('used-punk-record'))).toBe(true)
  })

  test('1ページ目 (アウトレット一覧)', () => {
    expect(hasNextPage(readSample('outlet-punk-record'))).toBe(true)
  })

  test('最終ページ', () => {
    expect(hasNextPage(readSample('outlet-punk-record-last'))).toBe(false)
  })

  test('ページャーがない', () => {
    expect(hasNextPage('<html><body></body></html>')).toBe(false)
  })
})
