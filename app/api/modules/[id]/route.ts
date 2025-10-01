import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { moduleSchema } from '@/lib/validations'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleItem = await prisma.module.findUnique({
      where: { id: params.id },
      include: { questions: { orderBy: { order: 'asc' } } }
    })
    if (!moduleItem) return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 })
    return NextResponse.json(moduleItem)
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const data = moduleSchema.partial().parse(body)
    const updated = await prisma.module.update({ where: { id: params.id }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.module.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


