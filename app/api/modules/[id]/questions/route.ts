import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que le module existe
    const module = await prisma.module.findUnique({
      where: { id: params.id }
    })
    
    if (!module) {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 })
    }
    
    const questions = await prisma.question.findMany({
      where: { moduleId: params.id },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(questions)
  } catch (e: any) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
