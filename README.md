# Relationnel - Application de Socles Relationnels

Une application web moderne pour découvrir et analyser les socles qui comptent le plus dans vos relations. Cette application utilise l'IA pour générer des insights personnalisés basés sur un questionnaire en 4 modules.

## 🚀 Fonctionnalités

### Pour les Utilisateurs
- **Questionnaire interactif** en 4 modules (Communication, Intimité, Objectifs, Sécurité)
- **Interface moderne** avec design gris/rose élégant
- **Génération d'insights IA** personnalisés
- **Export PDF** des résultats
- **Envoi par email** des rapports (fonctionnalité à venir)

### Pour les Administrateurs
- **Dashboard complet** pour gérer l'application
- **CRUD des modules** et questions
- **Gestion des utilisateurs**
- **Analytiques** et statistiques
- **Configuration IA**

## 🛠️ Technologies Utilisées

- **Next.js 14** avec App Router
- **TypeScript** pour le typage
- **Tailwind CSS** pour le styling
- **Prisma** pour l'ORM
- **Supabase** pour la base de données
- **Zod** pour la validation
- **Framer Motion** pour les animations
- **OpenRouter** pour l'IA
- **jsPDF** pour la génération de PDF

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd relationnel
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Remplir les variables d'environnement :
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/relationnel"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API
OPENROUTER_API_KEY=your_openrouter_api_key

# App
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Configuration de la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Lancer l'application**
```bash
npm run dev
```

## 🎨 Design

L'application utilise une palette de couleurs douce et moderne :
- **Fond principal** : Dégradé gris clair
- **Couleurs primaires** : Rose et nuances similaires
- **Interface** : Design épuré avec des éléments glassmorphism
- **Animations** : Transitions fluides avec Framer Motion

## 📱 Pages Principales

### Page d'Accueil (`/`)
- Section hero avec call-to-action
- Présentation des 4 modules
- Design attractif avec animations

### Questionnaire (`/questionnaire`)
- Parcours en 4 modules
- Barre de progression
- Questions interactives (texte, choix multiples, échelle)
- Navigation fluide entre modules

### Résultats (`/results`)
- Affichage des insights générés par l'IA
- Bouton de téléchargement PDF
- Formulaire d'envoi par email
- Design de présentation élégant

### Dashboard Admin (`/admin`)
- Gestion des modules et questions
- Gestion des utilisateurs
- Analytiques et statistiques
- Configuration de l'IA

## 🤖 Intégration IA

L'application utilise **OpenRouter** pour générer des insights personnalisés :
- Analyse des réponses du questionnaire
- Génération de rapports structurés
- Insights sur les priorités relationnelles
- Recommandations personnalisées

## 📄 Génération PDF

- Conversion HTML vers PDF avec jsPDF
- Design personnalisé pour les rapports
- Mise en forme professionnelle
- Téléchargement automatique

## 🔧 API Routes

- `GET /api/modules` - Récupérer les modules
- `POST /api/modules` - Créer un module
- `POST /api/sessions` - Créer une session de questionnaire
- `GET /api/reports/[sessionId]` - Récupérer un rapport

## 🚀 Déploiement

L'application est prête pour le déploiement sur :
- **Vercel** (recommandé)
- **Netlify**
- **Railway**
- **Heroku**

## 📈 Roadmap

- [ ] Système d'authentification complet
- [ ] Envoi d'emails automatique
- [ ] Notifications push
- [ ] Version mobile native
- [ ] Intégration avec d'autres IA
- [ ] Système de recommandations avancé

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation

---

**Relationnel** - Découvrez vos socles relationnels avec l'IA ✨
