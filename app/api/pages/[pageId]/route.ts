import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { AppConfig } from 'next/dist/build/utils'
import * as z from 'zod'
import { PageStatus } from '@/domain/domain'

export const dynamic: AppConfig['dynamic'] = 'force-dynamic'

const pagePutRequestBody = z.object({
  name: z.string().max(500).optional(),
  url: z.string().url().optional(),
  status: z.nativeEnum(PageStatus).optional()
})

export type PagePutRequestBody = z.infer<typeof pagePutRequestBody>

export async function PUT(req: Request, { params }: { params: { pageId: string } }) {
  try {
    const input = pagePutRequestBody.parse(req.body)
    const { pageId } = params

    const result = await prisma.pages.update({
      where: { id: Number(pageId) },
      data: {
        name: input.name,
        url: input.url,
        status: input.status
      }
    })
    console.log('[page/{pageId}/put]', result)

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }
}
