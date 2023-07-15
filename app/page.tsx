import Link from 'next/link'

// Prisma does not support Edge without the Data Proxy currently
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col p-8">
      <h2 className="text-2xl mb-6">DU Watcher</h2>
      <Link href={'/pages/'}>Go to pages</Link>
    </main>
  )
}
