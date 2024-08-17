import { Feed } from 'feed'
import type { Item } from '@/sdk/db/model/Item'
import { Result } from 'neverthrow'

export const buildFeedFromItemsAction = Result.fromThrowable(
  ({ items, feedItem }: { items: Item[]; feedItem: { feedId: string; name: string; description: string } }) => {
    const feed = new Feed({
      title: `DU Watcher: ${feedItem.name}`,
      description: `DU Watcher feed: ${feedItem.description}`,
      id: `https://github.com/t-skgm/du-watcher/${feedItem.feedId}`,
      link: 'https://github.com/t-skgm/du-watcher',
      copyright: 't-skgm',
      generator: 'du-watcher',
      author: {
        name: 't-skgm'
      },
      feed: `https://t-skgm.github.io/du-watcher/feed_${feedItem.feedId}.xml`
    })

    items.forEach(item => {
      feed.addItem({
        id: item.itemPageUrl,
        title: `${item.artist} - ${item.productTitle}`,
        date: new Date(item.updatedAt),
        link: item.itemPageUrl,
        content: `
        <b>${item.artist} - ${item.productTitle}</b><br>
        <br>
        価格: ${item.cheapestItemPrice}円<br>
        盤質: ${item.cheapestItemStatus}<br>
        ${item.isDiscountedPrice ? `割引率: ${item.discountRatePercentage}%` : ''}<br>
        <br>
        ${item.genre ? `ジャンル: ${item.genre}<br>` : ''}
        ${item.labelName ? `レーベル: ${item.labelName}<br>` : ''}
        ${item.media ? `フォーマット: ${item.media}<br>` : ''}
        <br>
        ${item.createdAt ? `登録日: ${item.createdAt}<br>` : ''}
        ${item.updatedAt ? `更新日: ${item.updatedAt}<br>` : ''}
        ${item.crawledAt ? `クロール日: ${item.crawledAt}<br>` : ''}
        <br>
        <a href="${item.itemPageUrl}">商品ページ</a>
        `
      })
    })

    return feed
  }
)
