'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { ItemOrderBy, OrderRule } from '@/domain/domain'
import { useUpdateQueryString } from '@/lib/useUpdateQueryString'

type HeaderOption = { label: string; value: ItemOrderBy }

const headers: HeaderOption[] = [
  { label: 'Artist', value: 'artist' },
  { label: 'Title', value: 'productTitle' },
  { label: 'Genre', value: 'genre' },
  { label: 'Cheapest price', value: 'cheapestItemPriceYen' },
  { label: 'Cheapest status', value: 'cheapestItemStatus' },
  { label: 'Crawled', value: 'crawledAt' }
]

export const ItemTableHeaders = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!
  const updateQueryString = useUpdateQueryString()

  const orderBy = useMemo(() => searchParams.get('orderBy') as ItemOrderBy | null, [searchParams])
  const orderRule = useMemo(() => searchParams.get('orderRule') as OrderRule | null, [searchParams])

  const handleHeaderClick = (value: string) => (_ev: unknown) => {
    const orderRuleValue = orderRule === 'desc' ? 'asc' : 'desc'
    router.push(
      `${pathname}?${updateQueryString([
        { name: 'orderBy', value },
        { name: 'orderRule', value: orderRuleValue }
      ])}`
    )
  }

  return (
    <tr>
      {headers.map(({ label, value }) => (
        <th
          key={value}
          scope="col"
          className={`px-6 py-4 font-medium text-gray-900 ${orderBy === value ? 'bg-gray-100' : ''}`}
          onClick={handleHeaderClick(value)}
        >
          {label}
          {orderBy === value && <span className="ml-1 text-gray-400">{orderRule === 'desc' ? '↓' : '↑'}</span>}
        </th>
      ))}
      {/* Action col header */}
      <th scope="col" className="px-6 py-4 font-medium text-gray-900"></th>
    </tr>
  )
}
