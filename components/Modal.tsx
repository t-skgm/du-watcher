'use client'

import { useRouter } from 'next/navigation'

type Props = {
  title: string
  children: React.ReactNode
}

export const Modal = ({ children, title }: Props) => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <>
      <div className="fixed inset-0 z-10 bg-slate-300/50 backdrop-blur" onClick={handleCancel}></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-xl">
          <div className="relative p-6">
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-4 right-4 rounded-lg p-1 text-center font-medium text-slate-500 transition-all hover:bg-slate-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
            <div className="py-2">{children}</div>
          </div>
          <div className="flex justify-end gap-3 bg-slate-50 px-6 py-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="rounded-lg border border-slate-500 bg-slate-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-slate-700 hover:bg-slate-700 focus:ring focus:ring-slate-200 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
