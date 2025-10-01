import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    const report = await prisma.generatedReport.findUnique({
      where: { sessionId },
      include: {
        session: {
          include: {
            responses: {
              include: {
                question: true
              }
            }
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Rapport non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rapport' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Contenu du rapport requis' },
        { status: 400 }
      )
    }

    const report = await prisma.generatedReport.upsert({
      where: { sessionId },
      update: { content },
      create: {
        sessionId,
        content
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error saving report:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du rapport' },
      { status: 500 }
    )
  }
}
