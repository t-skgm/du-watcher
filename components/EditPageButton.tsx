'use client'

export const EditPageButton = ({ pageId }: { pageId: number }) => {
  const onClick = () => {
    console.log('edit', pageId)
  }

  return (
    <button className="text-primary-700" onClick={onClick}>
      Edit
    </button>
  )
}
