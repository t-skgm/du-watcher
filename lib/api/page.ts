import { PagePostRequestBody } from '@/app/api/pages/route'
import { PagePutRequestBody } from '@/app/api/pages/[pageId]/route'

export const createPage = async (input: PagePostRequestBody) => {
  const result = await fetch(`/api/pages/`, {
    method: 'POST',
    body: JSON.stringify(input)
  })
  console.log('[page] Created.', result)
}

export const updatePage = async (pageId: string, input: PagePutRequestBody) => {
  const result = await fetch(`/api/pages/${pageId}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  })
  console.log('[page] Updated.', result)
}
