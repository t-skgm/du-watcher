import {
  CreatedTimePropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
  SelectPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
  RelationPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints'

type PageBase<Properties> = Omit<PageObjectResponse, 'parent' | 'properties'> & {
  parent: {
    type: 'database_id'
    database_id: string
  }
  properties: Properties
}

type RichTextPropertyItemsObjectResponse = {
  type: 'rich_text'
  rich_text: Array<RichTextItemResponse>
  id: string
}

type TitlePropertyItemsObjectResponse = {
  title: Array<RichTextItemResponse>
  type?: 'title'
}

export type PagePage = PageBase<{
  Title: TitlePropertyItemsObjectResponse
  Status: SelectPropertyItemObjectResponse
  LastCrawled: DatePropertyItemObjectResponse
  URL: UrlPropertyItemObjectResponse
}>

export type ItemPage = PageBase<{
  ItemID: TitlePropertyItemsObjectResponse
  ItemPageURL: UrlPropertyItemObjectResponse
  Artist: RichTextPropertyItemsObjectResponse
  Title: RichTextPropertyItemsObjectResponse
  Label: RichTextPropertyItemsObjectResponse
  Genre: SelectPropertyItemObjectResponse
  CheapestPriceYen: NumberPropertyItemObjectResponse
  CheapestStatus: SelectPropertyItemObjectResponse
  Crawled: DatePropertyItemObjectResponse
  Created: CreatedTimePropertyItemObjectResponse
  Page: RelationPropertyItemObjectResponse
}>
