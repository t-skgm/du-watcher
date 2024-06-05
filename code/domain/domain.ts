export const PageStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const

export type PageStatus = (typeof PageStatus)[keyof typeof PageStatus]

export const OrderRule = {
  asc: 'asc',
  desc: 'desc'
} as const

export type OrderRule = (typeof OrderRule)[keyof typeof OrderRule]

export const ActionType = {
  crawlStart: 'crawlStart',
  crawlEnd: 'crawlEnd',
  buildFeed: 'buildFeed'
} as const

export type ActionType = (typeof ActionType)[keyof typeof ActionType]
