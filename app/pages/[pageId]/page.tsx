type PageDetailProps = {
  params: {
    pageId: string
  }
}

export default function PagesDetail({ params }: PageDetailProps) {
  return <p>Detail: {params.pageId}</p>
}
