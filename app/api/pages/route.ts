import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { AppConfig } from 'next/dist/build/utils'
import * as z from 'zod'
import { PageStatus } from '@/domain/domain'

export const dynamic: AppConfig['dynamic'] = 'force-dynamic'

const pagePostRequestBody = z.object({
  name: z.string().max(500),
  url: z.string().url()
})

export type PagePostRequestBody = z.infer<typeof pagePostRequestBody>

export async function POST(req: Request) {
  try {
    const input = pagePostRequestBody.parse(await req.json())

    const result = await prisma.pages.create({
      data: {
        name: input.name,
        url: input.url,
        status: PageStatus.ACTIVE
      }
    })
    console.log('[page/post]', result)

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }
}
