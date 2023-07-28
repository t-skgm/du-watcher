import { prisma } from '@/lib/prisma'
import { Paginate } from '../shared/Paginate'

type Props = {
  take: number
  skip: number
}

export const ItemPaginate = async ({ take, skip }: Props) => {
  const totalItemCount = await prisma.items.count()

  return <Paginate take={take} skip={skip} totalItemCount={totalItemCount} />
}
