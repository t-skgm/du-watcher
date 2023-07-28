import { CraetePageForm } from '@/components/CreatePageForm'
import { Modal } from '@/components/Modal'

type PageNewProps = {}

export default function PageNew({}: PageNewProps) {
  return (
    <Modal title="New Page">
      <CraetePageForm />
    </Modal>
  )
}
