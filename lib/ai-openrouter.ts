// Alternative implementation using OpenAI SDK for OpenRouter
import OpenAI from 'openai'

export interface AIResponse {
  content: string
  success: boolean
  error?: string
}

export class AIServiceOpenRouter {
  private openai: OpenAI | null = null

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY
    
    if (apiKey) {
      this.openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Relationnel App',
        },
      })
    }
  }

  async generateInsights(responses: any[]): Promise<AIResponse> {
    try {
      if (!this.openai) {
        console.warn('OpenRouter API key not configured')
        return {
          content: '',
          success: false,
          error: 'OpenRouter API key not configured'
        }
      }

      const prompt = this.buildPrompt(responses)
      
      const completion = await this.openai.chat.completions.create({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en relations humaines et en psychologie. Tu analyses les réponses d\'un questionnaire sur les socles relationnels et tu génères des insights personnalisés et constructifs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content || ''

      return {
        content: this.formatResponse(content),
        success: true
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private buildPrompt(responses: any[]): string {
    const header = `Analyse les réponses suivantes d'un questionnaire relationnel et génère un rapport structuré et utile. Chaque entrée a la forme {questionId, question, answer}. Utilise le texte exact de chaque question et associe clairement la réponse correspondante.`

    const qaList = responses
      .map((r: any, i: number) => `${i + 1}. Q: ${r.question}\n   A: ${r.answer}`)
      .join('\n\n')

    const instructions = `\n\nAttendus du rapport (en français):\n- Analyse des priorités (avec références aux réponses)\n- Points forts\n- Zones d'amélioration\n- Recommandations concrètes (liste)\n- Synthèse finale courte\n\nFormat clair avec des titres en **gras**. Ne pas utiliser de texte barré.`

    return `${header}\n\n${qaList}${instructions}`
  }

  private formatResponse(content: string): string {
    // Basic sanitization and formatting
    const cleaned = content
      // remove strikethrough markdown and tags
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/<\/?(s|del)>/gi, '')
      // keep bold markers for downstream replacer on the page
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      // normalize new lines
      .replace(/\r\n/g, '\n')
      .trim()

    return cleaned
  }

}

export const aiServiceOpenRouter = new AIServiceOpenRouter()
