'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  take: number
  totalItemCount: number
  skip?: number
}

export const Pagination = (props: Props) => {
  const pathname = usePathname()
  const { currentPage, nextSkip, previousSkip, totalPages, hasNextPage, hasPreviousPage } = getPaginateProps(props)

  return (
    <div className="flex justify-center">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center space-x-1 rounded-md text-sm">
          <li>
            <Link
              href={hasPreviousPage ? `${pathname}?take=${props.take}&skip=${previousSkip}` : '#'}
              className="inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50"
            >
              <LeftArrow />
            </Link>
          </li>
          <li>
            <span className="inline-flex items-center space-x-1 rounded-md bg-white px-4 py-2 text-gray-500">
              Page <b className="mx-1">{currentPage}</b> of <b className="ml-1">{totalPages}</b>
            </span>
          </li>
          <li>
            <Link
              href={hasNextPage ? `${pathname}?take=${props.take}&skip=${nextSkip}` : '#'}
              className="inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50"
            >
              <RightArrow />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

const getPaginateProps = ({ skip, take, totalItemCount }: Props) => {
  const currentPage = skip ? Math.floor(skip / take) + 1 : 1
  const nextSkip = currentPage * take
  const previousSkip = currentPage > 1 ? (currentPage - 2) * take : 0
  const totalPages = Math.ceil(totalItemCount / take)

  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return {
    currentPage,
    nextSkip,
    previousSkip,
    totalPages,
    hasNextPage,
    hasPreviousPage
  }
}

const LeftArrow = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
      clipRule="evenodd"
    />
  </svg>
)

const RightArrow = () => (
  <svg
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    />
  </svg>
)
