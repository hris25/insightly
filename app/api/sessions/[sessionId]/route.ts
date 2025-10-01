import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        responses: {
          include: {
            question: true
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la session' },
      { status: 500 }
    )
  }
}
