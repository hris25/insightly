import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { moduleSchema } from '@/lib/validations'

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(modules)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des modules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = moduleSchema.parse(body)

    const module = await prisma.module.create({
      data: validatedData,
      include: {
        questions: true
      }
    })

    return NextResponse.json(module, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création du module' },
      { status: 500 }
    )
  }
}
