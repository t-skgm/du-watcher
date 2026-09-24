import { parse } from 'node-html-parser'

/** ページャーの「次へ」が有効か */
export const hasNextPage = (html: string) =>
  parse(html).querySelector('.pagenation-list .pagenation-next-arrow.active a') != null
