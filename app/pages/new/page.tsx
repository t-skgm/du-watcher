import { CraetePageForm } from '@/components/feature/CreatePageForm'

type PageNewProps = {}

export default function PageNew({}: PageNewProps) {
  return (
    <main className="relative flex min-h-screen flex-col p-8">
      <h1 className="text-4xl mb-4">Create new page</h1>
      <div className="bg-white rounded-md p-4">
        <CraetePageForm />
      </div>
    </main>
  )
}
