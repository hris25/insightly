# Relationnel App

Une application web pour découvrir ses 3 non-négociables relationnels à travers un questionnaire personnalisé.

## 🚀 Fonctionnalités

- Questionnaire interactif en 4 modules
- Génération de rapport personnalisé par IA
- Téléchargement PDF
- Dashboard administrateur
- Gestion des modules et questions

## 🛠️ Technologies

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **IA**: OpenRouter (Mistral)
- **PDF**: jsPDF, html2canvas

## 📋 Prérequis

- Node.js 18+
- Compte Supabase
- Clé API OpenRouter

## ⚙️ Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/hris25/insightly.git
   cd insightly
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   
   Créer un fichier `.env.local` :
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   
   # OpenRouter API
   OPENROUTER_API_KEY="your_openrouter_api_key_here"
   
   # NextAuth
   NEXTAUTH_SECRET="your_nextauth_secret_here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Configuration de la base de données**
   ```bash
   npx prisma db push
   npx prisma generate
   npm run db:seed
   ```

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

## 🚀 Déploiement sur Vercel

1. **Connecter le projet à Vercel**
   - Importer depuis GitHub
   - Configurer les variables d'environnement dans Vercel

2. **Variables d'environnement requises**
   - `DATABASE_URL`
   - `OPENROUTER_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_APP_URL`

3. **Déploiement automatique**
   - Le build inclut `prisma generate`
   - Les migrations sont appliquées automatiquement

## 📁 Structure du projet

```
├── app/
│   ├── admin/           # Dashboard administrateur
│   ├── api/             # API Routes
│   ├── questionnaire/   # Page questionnaire
│   ├── results/         # Page résultats
│   └── globals.css      # Styles globaux
├── components/          # Composants réutilisables
├── lib/                 # Utilitaires (Prisma, AI, PDF)
├── prisma/              # Schéma et migrations
└── public/              # Assets statiques
```

## 🔧 Scripts disponibles

- `npm run dev` - Développement
- `npm run build` - Build production
- `npm run start` - Serveur production
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Pousser le schéma vers la DB
- `npm run db:seed` - Peupler la DB avec des données de test

## 📝 API Endpoints

### Modules
- `GET /api/modules` - Liste des modules
- `POST /api/modules` - Créer un module
- `PUT /api/modules/[id]` - Modifier un module
- `DELETE /api/modules/[id]` - Supprimer un module

### Questions
- `GET /api/questions` - Liste des questions
- `GET /api/modules/[id]/questions` - Questions d'un module
- `POST /api/questions` - Créer une question
- `PUT /api/questions/[id]` - Modifier une question
- `DELETE /api/questions/[id]` - Supprimer une question

### Sessions
- `POST /api/sessions` - Créer une session
- `GET /api/sessions/[id]` - Récupérer une session

### Rapports
- `GET /api/reports/[sessionId]` - Récupérer un rapport
- `POST /api/reports/[sessionId]` - Créer un rapport

## 🎨 Personnalisation

- **Couleurs** : Modifier `tailwind.config.js`
- **Questions** : Via le dashboard admin
- **IA** : Changer le modèle dans `lib/ai-openrouter.ts`

## 🐛 Dépannage

### Erreur Prisma sur Vercel
- Vérifier que `DATABASE_URL` est correcte
- S'assurer que `prisma generate` est dans le build

### Erreur OpenRouter
- Vérifier la clé API
- Vérifier les limites de quota

## 📄 Licence

MIT License
