import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { PageStatus } from '@prisma/client'

export async function POST(request: Request, { params }: { params: { pageId: string } }) {
  const body: ItemsCreateInput = await request.json()

  const updated = await prisma.pages.update({
    where: { id: Number(params.pageId) },
    data: {
      name: body.name,
      url: body.url,
      status: body.status
    }
  })

  return NextResponse.json(updated)
}

export type ItemsCreateInput = {
  name?: string
  url?: string
  status?: PageStatus
}
