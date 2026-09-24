/**
 * 一覧URLに対してページ番号を指定したURLを作る
 *
 * 絞り込み条件はセッションに保存されるが、`base_search[...]` をクエリに付けても適用される。
 * サイトのページャーのリンクは一部の条件（フォーマット等）を落とすため、リンクを辿らずにこちらで組み立てる。
 * `nors=1` はサイト側のページャーに倣って付与する。
 */
export const buildPageUrl = (url: string, pageNo: number): string => {
  const u = new URL(url)
  u.searchParams.set('nors', '1')
  u.searchParams.set('pageno', String(pageNo))
  return u.toString()
}
