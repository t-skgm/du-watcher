'use client'

import { createPage } from '@/lib/api/page'

export const CreatePageButton = () => {
  const onClick = async () => {
    await createPage({
      name: '',
      url: ''
    })
  }

  return (
    <button className="text-primary-700 p-2 mb-4 bg-cyan-100 border-cyan-500 border-2" onClick={onClick}>
      Create
    </button>
  )
}
