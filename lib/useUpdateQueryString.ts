import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const useUpdateQueryString = () => {
  const searchParams = useSearchParams()!

  const updateQueryString = useCallback(
    (newParams: { name: string; value: string | number }[]) => {
      const params = new URLSearchParams(searchParams)
      newParams.forEach(({ name, value }) => params.set(name, value.toString()))
      return params.toString()
    },
    [searchParams]
  )

  return updateQueryString
}
