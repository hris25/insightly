export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  title: string
  description: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  questions: Question[]
}

export interface Question {
  id: string
  moduleId: string
  text: string
  type: 'text' // Only text questions
  order: number
  isRequired: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Response {
  id: string
  sessionId: string
  questionId: string
  userId?: string
  answer: string
  createdAt: Date
}

export interface Session {
  id: string
  userId?: string
  createdAt: Date
  updatedAt: Date
  responses: Response[]
}

export interface GeneratedReport {
  id: string
  sessionId: string
  content: string
  pdfUrl?: string
  createdAt: Date
}

export interface QuestionnaireData {
  sessionId: string
  responses: {
    questionId: string
    question: string
    answer: string
  }[]
}

export interface AIInsight {
  priorities: string[]
  strengths: string[]
  improvements: string[]
  recommendations: string[]
  summary: string
}
