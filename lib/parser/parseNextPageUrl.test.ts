import { beforeAll, describe, expect, test } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseNextPageUrl } from './parseNextPageUrl'

const snapshotHtml = readFileSync(resolve(__dirname, './test.snapshot.html'), { encoding: 'utf-8' })

describe('parseNextPageUrl()', () => {
  let result: string | undefined

  beforeAll(() => {
    result = parseNextPageUrl(snapshotHtml)
  })

  test('正しい', async () => {
    expect(result).toEqual('https://diskunion.net/used/ct/indiealt/new_ulist/0/637/0/0/0103103162/2/50/2')
  })
})
