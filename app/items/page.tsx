import { ItemPagination } from '@/components/feature/ItemPagination'
import { ItemTable } from '@/components/feature/ItemTable'
import { ItemOrderBy, OrderRule } from '@/domain/domain'
import { Suspense } from 'react'

// Prisma does not support Edge without the Data Proxy currently
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

type ItemIndexProps = {
  searchParams: {
    take?: string
    skip?: string
    orderBy?: ItemOrderBy
    orderRule?: OrderRule
  }
}

export default function ItemIndexProps({ searchParams }: ItemIndexProps) {
  const take = searchParams.take != null ? Number(searchParams.take) : 50
  const skip = searchParams.skip != null ? Number(searchParams.skip) : 0

  return (
    <main className="relative flex min-h-screen flex-col p-8">
      <h2 className="text-2xl mb-6">Items List</h2>

      <div className="my-6 p-4 bg-white">
        <Suspense fallback={<div>Loading...</div>}>
          <ItemPagination take={take} skip={skip} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ItemTable take={take} skip={skip} orderBy={searchParams.orderBy} orderRule={searchParams.orderRule} />
      </Suspense>

      <div className="my-6 p-4 bg-white">
        <Suspense fallback={<div>Loading...</div>}>
          <ItemPagination take={take} skip={skip} />
        </Suspense>
      </div>
    </main>
  )
}
