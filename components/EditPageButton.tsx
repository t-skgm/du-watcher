'use client'

import { ItemsCreateInput } from '@/app/page/[pageId]/route'

export const EditPageButton = ({ pageId }: { pageId: number }) => {
  const update = async (input: ItemsCreateInput) => {
    const result = await fetch(`/page/${pageId}`, {
      method: 'POST',
      body: JSON.stringify(input)
    })
    console.log('Updated.', result)
  }

  const onClick = () => {
    console.log('edit', pageId)
  }

  return (
    <button className="text-primary-700" onClick={onClick}>
      Edit
    </button>
  )
}
