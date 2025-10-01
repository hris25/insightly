import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
})

export const moduleSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  order: z.number().int().min(0),
  isActive: z.boolean().default(true),
})

export const questionSchema = z.object({
  text: z.string().min(5, 'La question doit contenir au moins 5 caractères'),
  type: z.literal('text'), // Only text questions
  order: z.number().int().min(0),
  isRequired: z.boolean().default(true),
  moduleId: z.string().min(1, 'ID de module requis'),
})

export const responseSchema = z.object({
  questionId: z.string().min(1, 'ID de question requis'),
  answer: z.string().min(1, 'Une réponse est requise'),
})

export const sessionSchema = z.object({
  userId: z.string().optional(),
  responses: z.array(responseSchema),
})

export const emailSchema = z.object({
  email: z.string().email('Email invalide'),
})

export type UserInput = z.infer<typeof userSchema>
export type ModuleInput = z.infer<typeof moduleSchema>
export type QuestionInput = z.infer<typeof questionSchema>
export type ResponseInput = z.infer<typeof responseSchema>
export type SessionInput = z.infer<typeof sessionSchema>
export type EmailInput = z.infer<typeof emailSchema>
