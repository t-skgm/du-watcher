import Link from 'next/link'

// Prisma does not support Edge without the Data Proxy currently
export const preferredRegion = 'home'
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col p-8 bg-white">
      <h2 className="text-2xl mb-6">DU Watcher</h2>
      <ul>
        <li>
          <Link href={'/pages'} className="text-blue-500">
            Pages
          </Link>
        </li>
        <li>
          <Link href={'/items'} className="text-blue-500">
            Items
          </Link>
        </li>
      </ul>
    </main>
  )
}
