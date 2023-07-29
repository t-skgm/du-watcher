import { prisma } from '@/lib/prisma'
import { Pagination } from '../shared/Pagination'

type Props = {
  take: number
  skip: number
}

export const ItemPagination = async ({ take, skip }: Props) => {
  const totalItemCount = await prisma.items.count()

  return <Pagination take={take} skip={skip} totalItemCount={totalItemCount} />
}
