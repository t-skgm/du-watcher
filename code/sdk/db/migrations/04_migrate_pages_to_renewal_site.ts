import { Kysely, sql } from 'kysely'
import { tableNames } from '../model/tableNames'

/**
 * サイトリニューアル (2026-09) に伴い、クロール対象ページのURLを新サイトのものへ移行する
 *
 * 新サイトは絞り込み条件を `base_search[...]` クエリで受け付ける。
 * 大分類フォーマット (GeneralFormats) と個別フォーマット (Formats) は AND 条件になるため、
 * 旧ページにあった APPAREL / DVD / BOOK は対象外とし、アナログ (GeneralFormats=2) のみとする。
 */

const BASE = 'https://diskunion.net'

const buildUrl = (path: string, categoryId?: number) => {
  const params = new URLSearchParams()
  if (categoryId != null) params.append('base_search[category_ids][level_categories][]', String(categoryId))
  // 2: レコード
  params.append('base_search[formats][GeneralFormats][]', '2')
  params.append('base_search[disp_number]', '60')
  return `${BASE}${path}?${params.toString()}`
}

type PageMigration = {
  id: number
  old: { url: string; title: string }
  new: { url: string; title: string }
}

const pages: PageMigration[] = [
  {
    id: 1,
    old: {
      url: 'https://diskunion.net/used/ct/indiealt/new_ulist/0/637/0/0/0103103162/2/50',
      title: '中古 / INDIE / GUITAR POP / アナログ'
    },
    // 36: ギターポップ
    new: { url: buildUrl('/used/indie_rock/new_release', 36), title: '中古 / INDIE / GUITAR POP / アナログ' }
  },
  {
    id: 2,
    old: {
      url: 'https://diskunion.net/used/ct/indiealt/new_ulist/0/639/0/0/010310316209/7/50/',
      title: '中古 / INDIE / ALTERNATIVE ROCK / アナログ'
    },
    // 41: オルタナティヴロック・グランジ
    new: { url: buildUrl('/used/indie_rock/new_release', 41), title: '中古 / INDIE / ALTERNATIVE ROCK / アナログ' }
  },
  {
    id: 3,
    old: {
      url: 'https://diskunion.net/used/ct/indiealt/new_ulist/0/638/0/0/01020310316209/0/50',
      title: '中古 / INDIE / SSW / アナログ'
    },
    // 40: シンガーソングライター・インディフォーク・オルタナティヴカントリー
    new: { url: buildUrl('/used/indie_rock/new_release', 40), title: '中古 / INDIE / SSW / アナログ' }
  },
  {
    id: 4,
    old: {
      url: 'https://diskunion.net/used/ct/punk/new_ulist/0/068/0/0/010203100928/0/50/',
      title: '中古 / PUNK / EMO/POST ROCK・HC/CHAOTIC HC / アナログ,APPAREL'
    },
    // 116: エモ・ポストロック・ポストハードコア・カオティックハードコア
    new: { url: buildUrl('/used/punk/new_release', 116), title: '中古 / PUNK / EMO/POST ROCK・HC/CHAOTIC HC / アナログ' }
  },
  {
    id: 5,
    old: {
      url: 'https://diskunion.net/used/ct/punk/new_ulist/0/210/0/0/0102031009061126/0/50/',
      title: '中古 / PUNK / POP PUNK/MELODIC PUNK/アナログ,DVD,BOOK,APPAREL'
    },
    // 112: ポップパンク・メロディックパンク
    new: { url: buildUrl('/used/punk/new_release', 112), title: '中古 / PUNK / POP PUNK/MELODIC PUNK / アナログ' }
  },
  {
    id: 6,
    old: {
      url: 'https://diskunion.net/indiealt/ct/sale/0/0/0/010203106209/0/0/50/0/0/0/0/0/0',
      title: 'アウトレット / ROCK/POPS/INDIE / アナログ'
    },
    new: { url: buildUrl('/indie_rock/outlet'), title: 'アウトレット / ROCK/POPS/INDIE / アナログ' }
  },
  {
    id: 7,
    old: {
      url: 'https://diskunion.net/punk/ct/sale/0/0/0/01020310316209/0/0/50/31/0/0/0/0/0',
      title: 'アウトレット / PUNK / アナログ'
    },
    new: { url: buildUrl('/punk/outlet'), title: 'アウトレット / PUNK / アナログ' }
  },
  {
    id: 8,
    old: {
      url: 'https://diskunion.net/jp/ct/sub/115/0/01020310316209/6/1/50/0/0',
      title: '中古 / 日本のロック / アナログ'
    },
    // 614: 日本のロック
    new: { url: buildUrl('/used/j_pop/new_release', 614), title: '中古 / 日本のロック / アナログ' }
  }
]

const updatePages = async (db: Kysely<unknown>, direction: 'old' | 'new') => {
  const from = direction === 'new' ? 'old' : 'new'
  for (const page of pages) {
    // 想定外のURLになっているページは上書きしない
    await sql`
      update ${sql.table(tableNames.pages)}
      set url = ${page[direction].url}, title = ${page[direction].title}
      where id = ${page.id} and url = ${page[from].url}
    `.execute(db)
  }
}

export async function up(db: Kysely<unknown>): Promise<void> {
  await updatePages(db, 'new')
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await updatePages(db, 'old')
}
