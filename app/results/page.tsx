'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, Heart, Sparkles, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { pdfService } from '@/lib/pdf'
import { aiServiceOpenRouter } from '@/lib/ai-openrouter'

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  const [isGenerating, setIsGenerating] = useState(true)
  const [report, setReport] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [email, setEmail] = useState('')
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)

  useEffect(() => {
    if (sessionId) {
      generateReport()
    } else {
      // Si pas de sessionId, rediriger vers le questionnaire
      router.push('/questionnaire')
    }
  }, [sessionId, router])

  const generateReport = async () => {
    try {
      // Récupérer les données de la session depuis l'API
      const response = await fetch(`/api/reports/${sessionId}`)
      
      if (response.ok) {
        // Le rapport existe déjà dans la base de données
        const sessionData = await response.json()
        setReport(sessionData.content)
        setIsGenerating(false)
        return
      }
      
      // Si le rapport n'existe pas, récupérer les réponses et générer le rapport
      const sessionResponse = await fetch(`/api/sessions/${sessionId}`)
      if (!sessionResponse.ok) {
        throw new Error('Session not found')
      }
      
      const sessionData = await sessionResponse.json()
      const responses = sessionData.responses.map((r: any) => ({
        question: r.question.text,
        answer: r.answer
      }))

      const aiResponse = await aiServiceOpenRouter.generateInsights(responses)

      // Afficher toujours ce que l'IA renvoie si présent
      if (aiResponse.content && aiResponse.content.trim().length > 0) {
        console.log('AI content:', aiResponse.content)
        setReport(aiResponse.content)
        // Optionnel : sauvegarder le rapport généré
        try {
          await fetch(`/api/reports/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: aiResponse.content })
          })
        } catch (saveError) {
          console.warn('Could not save report:', saveError)
        }
      } else {
        // Message d'erreur si l'IA échoue
        setReport(`**Erreur lors de la génération du rapport**

Désolé, nous n'avons pas pu générer votre rapport personnalisé à ce moment. 

Vos réponses ont été enregistrées et vous pouvez :
- Réessayer plus tard
- Contacter le support si le problème persiste
- Consulter vos réponses directement dans votre espace personnel

Merci de votre compréhension.`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Erreur lors de la génération du rapport')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!report) return

    setIsDownloading(true)
    try {
      const blob = await pdfService.generatePDF({
        title: 'Rapport de vos socles relationnels',
        content: report,
        userInfo: {
          name: 'Utilisateur', // En production, récupérer depuis la session
        }
      })

      pdfService.downloadPDF(blob, 'rapport-relationnel.pdf')
      toast.success('PDF téléchargé avec succès !')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Erreur lors de la génération du PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      // Ici, on enverrait l'email avec le PDF
      // Pour l'instant, on simule juste l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEmailSubmitted(true)
      toast.success('Email envoyé avec succès !')
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email')
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Génération de votre rapport...
          </h2>
          <p className="text-gray-600">
            Notre IA analyse vos réponses pour créer un rapport personnalisé
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-primary-300 font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Rapport généré avec succès
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Vos socles relationnels
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez les insights uniques sur vos priorités relationnelles, 
            générés spécialement pour vous.
          </p>
        </motion.div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="prose prose-lg max-w-none">
            <div
              className="whitespace-pre-wrap text-gray-200 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: report
                  // bold
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-600">$1</strong>')
                  // remove remaining strike markers
                  .replace(/~~(.*?)~~/g, '$1')
              }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Génération PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Télécharger le PDF
              </>
            )}
          </button>

          {/* Email Form */}
          {!isEmailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full">
                <Mail className="w-5 h-5 text-primary-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 min-w-[200px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-white/80 backdrop-blur-sm text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Recevoir par email
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5" />
              Email envoyé avec succès !
            </div>
          )}
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/questionnaire')}
              className="group bg-white/80 backdrop-blur-sm text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Refaire le questionnaire
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="group bg-white/80 backdrop-blur-sm text-gray-600 px-6 py-3 rounded-full font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Retour à l'accueil
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
