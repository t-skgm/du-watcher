import { PagePagination } from '@/components/feature/PagePagination'
import { PageTable } from '@/components/feature/PageTable'
import { Suspense } from 'react'

// Prisma does not support Edge without the Data Proxy currently
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

type PagesIndexProps = {
  searchParams: {
    take?: string
    skip?: string
  }
}

export default function PagesIndex({ searchParams }: PagesIndexProps) {
  const take = searchParams.take != null ? Number(searchParams.take) : 50
  const skip = searchParams.skip != null ? Number(searchParams.skip) : 0

  return (
    <main className="relative flex min-h-screen flex-col p-8">
      <h2 className="text-2xl mb-6">Pages List</h2>

      <div className="my-6 p-4 bg-white">
        <Suspense fallback={<div>Loading...</div>}>
          <PagePagination take={take} skip={skip} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PageTable />
      </Suspense>

      <div className="my-6 p-4 bg-white">
        <Suspense fallback={<div>Loading...</div>}>
          <PagePagination take={take} skip={skip} />
        </Suspense>
      </div>
    </main>
  )
}
