import { parse } from 'node-html-parser'

export const parseNextPageUrl = (html: string, baseUrl: string) => {
  const doc = parse(html)
  const nextPageUrl = doc.querySelector('.current + a')?.getAttribute('href')
  return nextPageUrl && `${baseUrl}${nextPageUrl}`
}
