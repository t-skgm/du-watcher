import { ItemPaginate } from '@/components/feature/ItemPaginate'
import { ItemTable } from '@/components/feature/ItemTable'
import { Suspense } from 'react'

// Prisma does not support Edge without the Data Proxy currently
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

type ItemIndexProps = {
  searchParams: {
    take?: string
    skip?: string
  }
}

export default function ItemIndexProps({ searchParams }: ItemIndexProps) {
  const take = searchParams.take ? Number(searchParams.take) : 50
  const skip = searchParams.skip ? Number(searchParams.skip) : 0

  return (
    <main className="relative flex min-h-screen flex-col p-8 bg-white">
      <h2 className="text-2xl mb-6">Items List</h2>

      <div className="my-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ItemPaginate take={take} skip={skip} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ItemTable take={take} skip={skip} />
      </Suspense>

      <div className="my-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ItemPaginate take={take} skip={skip} />
        </Suspense>
      </div>
    </main>
  )
}
