import { PageTable } from '@/components/PageTable'
import { Suspense } from 'react'

// Prisma does not support Edge without the Data Proxy currently
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

export default function PagesIndex() {
  return (
    <main className="relative flex min-h-screen flex-col p-8">
      <h2 className="text-2xl mb-6">Pages List</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <PageTable />
      </Suspense>
    </main>
  )
}
