import { prisma } from '@/lib/prisma'
import { ItemTableHeaders } from './ItemTableHeaders'

type Props = {
  take?: number
  skip?: number
}

export const ItemTable = async ({ take = 30, skip = 0 }: Props) => {
  const items = await prisma.items.findMany({ take, skip, orderBy: [{ crawledAt: 'desc' }, { artist: 'asc' }] })

  return (
    <div className="">
      <table className="w-full border-collapse border border-gray-200 bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <ItemTableHeaders />
        </thead>

        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {items.map(item => (
            <tr key={item.itemId}>
              <td className="px-6 py-4 font-medium text-gray-900">{item.artist}</td>
              <td className="px-6 py-4">
                <a
                  href={item.itemPageUrl}
                  className="text-blue-500 font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.productTitle}
                </a>{' '}
                ({item.labelName})
              </td>
              <td className="px-6 py-4">{item.genre}</td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold">{item.cheapestItemPriceYen.toLocaleString()}円</span>
              </td>
              <td className="px-6 py-4">{item.cheapestItemStatus}</td>
              <td className="px-6 py-4">{item.crawledAt.toLocaleString()}</td>
              <td className="justify-end gap-4 px-6 py-4 font-medium">!</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
