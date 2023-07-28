import Link from 'next/link'

export const CreatePageButton = () => {
  return (
    <Link href={`/pages/new`} className="text-primary-700 p-2 mb-4 bg-blue-100 border-blue-300 border-2 rounded-lg">
      New
    </Link>
  )
}
