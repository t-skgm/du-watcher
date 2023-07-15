import { Modal } from '@/components/Modal'

type PageDetailProps = {
  params: {
    pageId: string
  }
}

export default function PagesDetail({ params }: PageDetailProps) {
  return (
    <Modal title="Pages">
      <div>{params.pageId}</div>
    </Modal>
  )
}
