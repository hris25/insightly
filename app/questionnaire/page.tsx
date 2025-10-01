'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import EmailModal from '@/components/EmailModal'

interface Question {
  id: string
  text: string
  type: 'text' | 'multiple_choice' | 'scale'
  options?: string[]
  isRequired: boolean
}

interface Module {
  id: string
  title: string
  description: string
  questions: Question[]
}

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentModule, setCurrentModule] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Toujours remonter en haut quand on change de module
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentModule])

  // Load modules from database
  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await fetch('/api/modules')
        const data = await response.json()
        setModules(data)
      } catch (error) {
        console.error('Error loading modules:', error)
        toast.error('Erreur lors du chargement des modules')
      } finally {
        setIsLoading(false)
      }
    }

    loadModules()
  }, [])

  const currentModuleData = modules[currentModule]
  const isLastModule = currentModule === modules.length - 1
  const isFirstModule = currentModule === 0

  // Afficher un loader pendant le chargement
  if (isLoading || !currentModuleData || modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Chargement du questionnaire...
          </h2>
          <p className="text-gray-300">
            Préparation de vos modules personnalisés
          </p>
        </div>
      </div>
    )
  }

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const isCurrentModuleComplete = () => {
    return currentModuleData.questions.every(question => {
      if (!question.isRequired) return true
      return responses[question.id] && responses[question.id].trim() !== ''
    })
  }

  const handleNextModule = () => {
    if (isCurrentModuleComplete()) {
      if (isLastModule) {
        handleSubmit()
      } else {
        setCurrentModule(prev => prev + 1)
        // Scroll vers le haut de la page
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } else {
      toast.error('Veuillez répondre à toutes les questions obligatoires')
    }
  }

  const handlePreviousModule = () => {
    if (!isFirstModule) {
      setCurrentModule(prev => prev - 1)
      // Scroll vers le haut de la page
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Ici, on enverra les données à l'API
      const allResponses = Object.entries(responses).map(([questionId, answer]) => {
        const question = modules.flatMap(m => m.questions).find(q => q.id === questionId)
        return {
          questionId,
          question: question?.text || '',
          answer
        }
      })

      // Simulation de l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Afficher le popup email avant de continuer
      setShowEmailModal(true)
    } catch (error) {
      toast.error('Erreur lors de la soumission')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      // Créer ou récupérer l'utilisateur
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const user = await userResponse.json()

      // Envoyer les réponses avec l'ID utilisateur
      const sessionResponse = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          responses: Object.entries(responses).map(([questionId, answer]) => ({
            questionId,
            answer
          }))
        })
      })

      if (sessionResponse.ok) {
        const session = await sessionResponse.json()
        // Redirection vers la page de résultats avec l'ID de session
        router.push(`/results?sessionId=${session.sessionId}`)
      }
    } catch (error) {
      console.error('Error submitting email:', error)
      toast.error('Erreur lors de l\'enregistrement')
    }
  }


  const renderQuestion = (question: Question) => {
    return (
      <textarea
        value={responses[question.id] || ''}
        onChange={(e) => handleResponseChange(question.id, e.target.value)}
        placeholder="Votre réponse..."
        className="w-full p-4 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none placeholder-gray-400"
        rows={6}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-400 rounded-full opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Questionnaire Relationnel</h1>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4" />
              <span>Module {currentModule + 1} sur {modules.length}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentModule + 1) / modules.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Module Header */}
        <motion.div
          key={currentModule}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {currentModuleData.title}
            </h2>
            <p className="text-lg text-gray-300">
              {currentModuleData.description}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentModuleData.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {index + 1}. {question.text}
                  {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {renderQuestion(question)}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousModule}
            disabled={isFirstModule}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              isFirstModule
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Précédent
          </button>

          <div className="flex items-center gap-2">
            {isCurrentModuleComplete() && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm text-gray-600">
              {isCurrentModuleComplete() ? 'Module terminé' : 'Répondez aux questions'}
            </span>
          </div>

          <button
            onClick={handleNextModule}
            disabled={!isCurrentModuleComplete() || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              !isCurrentModuleComplete() || isSubmitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Génération...
              </>
            ) : isLastModule ? (
              <>
                Terminer
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        isLoading={isSubmitting}
      />
    </div>
  )
}
