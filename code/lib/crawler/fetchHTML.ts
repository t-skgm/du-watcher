import retry from 'async-retry'

export const fetchHTML = async ({ url, referer = '' }: { url: string; referer: string }): Promise<string> => {
  return retry(
    async bail => {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          referer
        }
      })
      if (!res.ok) {
        const err = new Error(`[fetchHTML] HTTP ${res.status}, url: ${url}`)
        // 4xx はリトライしても変わらないので即時失敗
        if (res.status >= 400 && res.status < 500) {
          bail(err)
          return ''
        }
        throw err
      }
      const html = await res.text()
      return html
    },
    {
      retries: 3,
      onRetry: (e, attempt) => {
        console.log(`[fetchHTML] retry... #${attempt}, url: ${url}`)
        console.error(e)
      }
    }
  )
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
