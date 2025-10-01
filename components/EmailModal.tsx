'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, CheckCircle } from 'lucide-react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => Promise<void>
  isLoading?: boolean
}

export default function EmailModal({ isOpen, onClose, onSubmit, isLoading = false }: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      setIsSubmitting(true)
      await onSubmit(email)
      setIsSubmitted(true)
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setEmail('')
      }, 2000)
    } catch (error) {
      console.error('Error submitting email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Recevez votre rapport
                  </h2>
                  <p className="text-gray-300">
                    Entrez votre email pour recevoir votre rapport personnalisé par email
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting || !email.trim()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isLoading || isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Recevoir le rapport
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Email enregistré !
                </h2>
                <p className="text-gray-300">
                  Votre rapport sera envoyé à {email}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
