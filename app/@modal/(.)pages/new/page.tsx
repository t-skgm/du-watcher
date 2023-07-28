import { CraetePageForm } from '@/components/feature/CreatePageForm'
import { Modal } from '@/components/shared/Modal'

type PageNewProps = {}

export default function PageNew({}: PageNewProps) {
  return (
    <Modal title="New Page">
      <CraetePageForm />
    </Modal>
  )
}
