import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sessionSchema } from '@/lib/validations'
import { aiServiceOpenRouter } from '@/lib/ai-openrouter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sessionSchema.parse(body)

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: validatedData.userId ?? null,
        responses: {
          create: validatedData.responses.map(response => ({
            questionId: response.questionId,
            answer: response.answer,
            userId: validatedData.userId ?? null
          }))
        }
      },
      include: {
        responses: {
          include: {
            question: true
          }
        }
      }
    })

    // Generate AI insights
    const responsesForAI = session.responses
      .sort((a, b) => a.question.order - b.question.order)
      .map(response => ({
        questionId: response.questionId,
        question: response.question.text,
        answer: response.answer
      }))

    const aiResponse = await aiServiceOpenRouter.generateInsights(responsesForAI)

    if (aiResponse.success && aiResponse.content) {
      // Save generated report (upsert to ensure it's stored)
      await prisma.generatedReport.upsert({
        where: { sessionId: session.id },
        update: { content: aiResponse.content },
        create: { sessionId: session.id, content: aiResponse.content }
      })
    } else {
      console.error('AI generation failed:', aiResponse.error)
      // Continue without AI report
    }

    return NextResponse.json({
      sessionId: session.id,
      success: true,
      aiGenerated: aiResponse.success
    })
  } catch (error) {
    console.error('Error creating session:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
