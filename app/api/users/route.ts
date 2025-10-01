import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { userSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = userSchema.parse(body)

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    // Si l'utilisateur n'existe pas, le créer
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name
        }
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating/finding user:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création/récupération de l\'utilisateur' },
      { status: 500 }
    )
  }
}
