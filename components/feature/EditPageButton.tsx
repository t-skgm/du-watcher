import Link from 'next/link'

export const EditPageButton = ({ pageId }: { pageId: string }) => {
  // const onClick = async () => {
  //   console.log('edit', pageId)
  //   await updatePage(pageId, {
  //     status: 'ACTIVE'
  //   })
  // }

  // const { ModalComp, showModal } = useModal({
  //   title: `ページ編集: ${pageId}`,
  //   content: <div>コンテンツ</div>,
  //   onSubmit: onClick
  // })

  return (
    <div className="flex justify-center">
      <Link
        href={`/pages/${pageId}`}
        className="rounded-lg border border-slate-500 bg-slate-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-slate-700 hover:bg-slate-700 focus:ring focus:ring-slate-200 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
      >
        Edit
      </Link>
    </div>
  )
}
