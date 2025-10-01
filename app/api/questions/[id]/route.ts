import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { questionSchema } from '@/lib/validations'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: { module: true }
    })
    
    if (!question) {
      return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
    }
    
    return NextResponse.json(question)
  } catch (e: any) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const data = questionSchema.parse(body)
    
    // Vérifier que la question existe
    const existingQuestion = await prisma.question.findUnique({
      where: { id: params.id }
    })
    
    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
    }
    
    // Vérifier que le module existe
    const module = await prisma.module.findUnique({
      where: { id: data.moduleId }
    })
    
    if (!module) {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 })
    }
    
    const updated = await prisma.question.update({
      where: { id: params.id },
      data: {
        text: data.text,
        type: data.type,
        order: data.order,
        isRequired: data.isRequired,
        moduleId: data.moduleId
      }
    })
    
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que la question existe
    const existingQuestion = await prisma.question.findUnique({
      where: { id: params.id }
    })
    
    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
    }
    
    await prisma.question.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Question supprimée avec succès' })
  } catch (e: any) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}