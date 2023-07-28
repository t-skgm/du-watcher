import { prisma } from '@/lib/prisma'
import { EditPageButton } from '@/components/feature/EditPageButton'
import { CreatePageButton } from './CreatePageButton'

const headers = ['Title', 'URL', 'Status', 'CreatedAt']

export const PageTable = async () => {
  const pages = await prisma.pages.findMany({ take: 10 })

  return (
    <div className="">
      <div className="flex w-full justify-end">
        <CreatePageButton />
      </div>

      <table className="w-full border-collapse border border-gray-200 bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(h => (
              <th key={h} scope="col" className="px-6 py-4 font-medium text-gray-900">
                {h}
              </th>
            ))}
            {/* Edit col */}
            <th scope="col" className="px-6 py-4 font-medium text-gray-900"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {pages.map(page => (
            <tr key={page.id}>
              <th className="px-6 py-4 font-medium text-gray-900">{page.name}</th>
              <td className="px-6 py-4">{page.url}</td>
              <td className="px-6 py-4">{page.status === 'ACTIVE' ? <ActivePill /> : <InactivePill />}</td>
              <td className="px-6 py-4">{page.createdAt.toLocaleString()}</td>
              <td className="justify-end gap-4 px-6 py-4 font-medium">
                <EditPageButton pageId={page.id.toString()} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ActivePill = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
      <path
        fill="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clip="evenodd"
      />
    </svg>
    Active
  </span>
)

const InactivePill = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
    Inactive
  </span>
)
