'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, Sparkles, Users, Target, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-primary-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-400 rounded-full opacity-25 animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-primary-300 font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Découvre tes 3 Non Négociables Relationnels
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Construisez des
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                {' '}relations{' '}
              </span>
              solides
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            En 5 étapes simples, tu vas explorer ton histoire, tes expériences, tes besoins cachés… pour en extraire l’essentiel : tes 3 piliers relationnels, tes non négociables
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/questionnaire">
                <button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                  Commencer le parcours
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </button>
              </Link>
              
              <button className="group bg-gray-800/80 backdrop-blur-sm text-primary-400 px-8 py-4 rounded-full font-semibold text-lg border-2 border-primary-500/30 hover:border-primary-400 transition-all duration-300 flex items-center gap-3">
                <Heart className="w-5 h-5 group-hover:fill-primary-400 transition-colors" />
                En savoir plus
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why it's important section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Pourquoi c'est important ?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed"
          >
            <p className="text-gray-300">
              Parce que la plupart d'entre nous passons notre temps à cocher les cases de l'autre — est-ce que
              je lui plais, est-ce que je fais assez, est-ce que je corresponds ? — mais nous ne nous demandons
              jamais : <span className="text-primary-400 font-semibold">"Est-ce que lui/elle coche MES cases ?"</span>
            </p>
            
            <p className="text-gray-300">
              Et si tu ne sais pas encore quelles sont ces cases... tu risques de les laisser se définir par les autres.
            </p>
            
            <p className="text-gray-300">
              Ici, tu vas enfin mettre des mots sur ce qui compte vraiment pour toi, et recevoir à la fin une :
              un PDF avec tes <span className="text-primary-400 font-semibold">3 piliers</span>, leurs définitions, ton engagement, et un mantra clair.
            </p>
            
            <p className="text-gray-300">
              Chaque étape est courte (5 à 10 minutes), simple, sincère, réfléchie, pour une meilleure qualité de relation, 
              plus claire et plus alignée avec qui tu es vraiment.
            </p>
          </motion.div>

          {/* Important section with border */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="border-2 border-dashed border-primary-500 rounded-xl p-8 bg-gray-700/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  IMPORTANT
                </h3>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  Pour que ton résultat soit le plus juste et fidèle possible, je t'invite à réaliser les 5 modules d'un seul élan.
                </p>
                
                <p>
                  Avant de commencer, prends le temps de t'assurer que tu as 30 à 45 minutes devant toi, dans le calme et sans interruption.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-6 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à découvrir vos socles relationnels ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des milliers de personnes qui ont déjà exploré leurs priorités relationnelles
            </p>
            <Link href="/questionnaire">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
