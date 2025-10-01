// AI Service for generating relationship insights
export interface AIResponse {
  content: string
  success: boolean
  error?: string
}

export class AIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    // Using OpenRouter as the primary AI service
    this.apiKey = process.env.OPENROUTER_API_KEY || ''
    this.baseUrl = 'https://openrouter.ai/api/v1'
  }

  async generateInsights(responses: any[]): Promise<AIResponse> {
    try {
      // Vérifier si la clé API est configurée
      if (!this.apiKey) {
        console.warn('OpenRouter API key not configured')
        return {
          content: '',
          success: false,
          error: 'OpenRouter API key not configured'
        }
      }

      const prompt = this.buildPrompt(responses)
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Relationnel App',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free', // Modèle gratuit
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
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.warn(`OpenRouter API error: ${response.status} - ${errorText}`)
        return {
          content: '',
          success: false,
          error: `API Error: ${response.status} - ${errorText}`
        }
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content || ''

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
    let prompt = `Analysez les réponses suivantes d'un questionnaire sur les socles relationnels et générez un rapport personnalisé :

RÉPONSES DU QUESTIONNAIRE :
`

    responses.forEach((response, index) => {
      prompt += `${index + 1}. ${response.question} : ${response.answer}\n`
    })

    prompt += `

Veuillez générer un rapport structuré qui inclut :

1. **Analyse des priorités** : Quels sont les socles les plus importants pour cette personne ?
2. **Points forts** : Quelles sont ses forces relationnelles ?
3. **Zones d'amélioration** : Quels aspects pourraient être développés ?
4. **Recommandations** : Des conseils pratiques pour améliorer ses relations
5. **Synthèse** : Un résumé des insights clés

Le rapport doit être bienveillant, constructif et personnalisé. Utilisez un ton chaleureux et professionnel.`

    return prompt
  }

  private formatResponse(content: string): string {
    // Clean up the response and ensure proper formatting
    const cleaned = content
      // strip strikethrough markdown and HTML
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/<\/?(s|del)>/gi, '')
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      .replace(/\r\n/g, '\n')
      .trim()
    return cleaned
  }

}

export const aiService = new AIService()
