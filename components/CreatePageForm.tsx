'use client'

import * as React from 'react'
import * as Form from '@radix-ui/react-form'
import { useRouter } from 'next/navigation'
import { createPage } from '@/lib/api/page'
import { pages } from '@prisma/client'

export const CraetePageForm = () => {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // prevent default form submission
    event.preventDefault()

    const formData = Object.fromEntries(new FormData(event.currentTarget))

    try {
      const result: pages = await createPage({
        name: formData.name as string,
        url: formData.url as string
      })
      router.push(`/pages/${result.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form.Root onSubmit={handleSubmit} className="space-y-5">
      <Form.Field name="name">
        <Form.Label className="mb-1 block text-sm font-medium text-gray-700">Name</Form.Label>
        <Form.Control
          type="text"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
        />
        <Form.Message match="valueMissing" className="text-red-400 font-bold">
          Please enter
        </Form.Message>
        <Form.Message match="typeMismatch" className="text-red-400 font-bold">
          Please provide a valid text.
        </Form.Message>
      </Form.Field>

      <Form.Field name="url">
        <Form.Label className="mb-1 block text-sm font-medium text-gray-700">URL</Form.Label>
        <Form.Control
          type="url"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
        />
        <Form.Message match="valueMissing" className="text-red-400 font-bold">
          Please enter
        </Form.Message>
        <Form.Message match="typeMismatch" className="text-red-400 font-bold">
          Please provide a valid URL.
        </Form.Message>
      </Form.Field>

      <Form.Submit className="rounded-lg border border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300">
        Submit
      </Form.Submit>
    </Form.Root>
  )
}
