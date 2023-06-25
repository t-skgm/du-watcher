import { parse } from 'node-html-parser'
import { DU_BASE_URL } from './const'

export const parseNextPageUrl = (html: string) => {
  const doc = parse(html)
  const nextPageUrl = doc.querySelector('.current + a')?.getAttribute('href')
  return nextPageUrl && `${DU_BASE_URL}${nextPageUrl}`
}
