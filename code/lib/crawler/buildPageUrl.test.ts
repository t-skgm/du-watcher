import { describe, expect, test } from 'bun:test'
import { buildPageUrl } from './buildPageUrl'

describe('buildPageUrl()', () => {
  test('絞り込み条件を保ったまま pageno と nors を付与する', () => {
    const url =
      'https://example.net/used/punk/new_release?base_search%5Bformats%5D%5BGeneralFormats%5D%5B%5D=2&base_search%5Bdisp_number%5D=60'
    const result = new URL(buildPageUrl(url, 3))

    expect(result.pathname).toBe('/used/punk/new_release')
    expect(result.searchParams.getAll('base_search[formats][GeneralFormats][]')).toEqual(['2'])
    expect(result.searchParams.get('base_search[disp_number]')).toBe('60')
    expect(result.searchParams.get('pageno')).toBe('3')
    expect(result.searchParams.get('nors')).toBe('1')
  })

  test('既存の pageno を上書きする', () => {
    const result = new URL(buildPageUrl('https://example.net/punk/outlet?nors=1&pageno=5', 2))
    expect(result.searchParams.getAll('pageno')).toEqual(['2'])
    expect(result.searchParams.getAll('nors')).toEqual(['1'])
  })

  test('配列パラメータの複数値を保つ', () => {
    const url = 'https://example.net/used/punk/new_release?a%5B%5D=1&a%5B%5D=2'
    expect(new URL(buildPageUrl(url, 1)).searchParams.getAll('a[]')).toEqual(['1', '2'])
  })
})
