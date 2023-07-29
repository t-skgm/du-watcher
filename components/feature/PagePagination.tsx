import { prisma } from '@/lib/prisma'
import { Pagination } from '../shared/Pagination'

type Props = {
  take: number
  skip: number
}

export const PagePagination = async ({ take, skip }: Props) => {
  const totalPageCount = await prisma.pages.count()

  return <Pagination take={take} skip={skip} totalItemCount={totalPageCount} />
}
