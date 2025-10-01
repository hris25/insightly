import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { questionSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')
    
    if (moduleId) {
      // Récupérer les questions d'un module spécifique
      const questions = await prisma.question.findMany({
        where: { moduleId },
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(questions)
    } else {
      // Récupérer toutes les questions
      const questions = await prisma.question.findMany({
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(questions)
    }
  } catch (e: any) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = questionSchema.parse(body)
    
    // Vérifier que le module existe
    const module = await prisma.module.findUnique({
      where: { id: data.moduleId }
    })
    
    if (!module) {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 })
    }
    
    const created = await prisma.question.create({ 
      data: {
        text: data.text,
        type: data.type,
        order: data.order,
        isRequired: data.isRequired,
        moduleId: data.moduleId
      }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.message }, { status: 400 })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


