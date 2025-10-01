import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.response.deleteMany()
  await prisma.generatedReport.deleteMany()
  await prisma.session.deleteMany()
  await prisma.question.deleteMany()
  await prisma.module.deleteMany()
  await prisma.user.deleteMany()

  // Create modules
  const module1 = await prisma.module.create({
    data: {
      title: 'Connaissance de soi',
      description: 'Explorez votre identité et vos valeurs relationnelles',
      order: 1,
      isActive: true,
    }
  })

  const module2 = await prisma.module.create({
    data: {
      title: 'Relations actuelles',
      description: 'Analysez vos relations existantes et leurs dynamiques',
      order: 2,
      isActive: true,
    }
  })

  const module3 = await prisma.module.create({
    data: {
      title: 'Défis relationnels',
      description: 'Identifiez les obstacles et les difficultés dans vos relations',
      order: 3,
      isActive: true,
    }
  })

  const module4 = await prisma.module.create({
    data: {
      title: 'Objectifs relationnels',
      description: 'Définissez vos aspirations et objectifs pour l\'avenir',
      order: 4,
      isActive: true,
    }
  })

  // Create questions for Module 1 - Connaissance de soi
  await prisma.question.createMany({
    data: [
      {
        moduleId: module1.id,
        text: 'Quelles sont les trois valeurs les plus importantes pour vous dans vos relations ?',
        type: 'text',
        order: 1,
        isRequired: true,
      },
      {
        moduleId: module1.id,
        text: 'Comment décririez-vous votre style de communication naturel ?',
        type: 'text',
        order: 2,
        isRequired: true,
      },
      {
        moduleId: module1.id,
        text: 'Quels sont vos besoins émotionnels essentiels dans une relation ?',
        type: 'text',
        order: 3,
        isRequired: true,
      },
      {
        moduleId: module1.id,
        text: 'Décrivez une situation relationnelle où vous vous êtes sentie particulièrement à l\'aise et authentique.',
        type: 'text',
        order: 4,
        isRequired: true,
      },
    ]
  })

  // Create questions for Module 2 - Relations actuelles
  await prisma.question.createMany({
    data: [
      {
        moduleId: module2.id,
        text: 'Comment décririez-vous la qualité de vos relations actuelles ?',
        type: 'text',
        order: 1,
        isRequired: true,
      },
      {
        moduleId: module2.id,
        text: 'Qu\'est-ce qui fonctionne le mieux dans vos relations actuelles ?',
        type: 'text',
        order: 2,
        isRequired: true,
      },
      {
        moduleId: module2.id,
        text: 'Y a-t-il des patterns récurrents dans vos relations que vous aimeriez changer ?',
        type: 'text',
        order: 3,
        isRequired: true,
      },
      {
        moduleId: module2.id,
        text: 'Comment vos relations actuelles reflètent-elles vos valeurs ?',
        type: 'text',
        order: 4,
        isRequired: true,
      },
    ]
  })

  // Create questions for Module 3 - Défis relationnels
  await prisma.question.createMany({
    data: [
      {
        moduleId: module3.id,
        text: 'Quels sont les défis les plus récurrents dans vos relations ?',
        type: 'text',
        order: 1,
        isRequired: true,
      },
      {
        moduleId: module3.id,
        text: 'Comment gérez-vous généralement les conflits relationnels ?',
        type: 'text',
        order: 2,
        isRequired: true,
      },
      {
        moduleId: module3.id,
        text: 'Qu\'est-ce qui vous empêche parfois d\'être pleinement vous-même dans vos relations ?',
        type: 'text',
        order: 3,
        isRequired: true,
      },
      {
        moduleId: module3.id,
        text: 'Quels sont vos plus grandes peurs dans les relations ?',
        type: 'text',
        order: 4,
        isRequired: true,
      },
    ]
  })

  // Create questions for Module 4 - Objectifs relationnels
  await prisma.question.createMany({
    data: [
      {
        moduleId: module4.id,
        text: 'Comment imaginez-vous votre relation idéale ?',
        type: 'text',
        order: 1,
        isRequired: true,
      },
      {
        moduleId: module4.id,
        text: 'Quels sont vos objectifs prioritaires pour améliorer vos relations ?',
        type: 'text',
        order: 2,
        isRequired: true,
      },
      {
        moduleId: module4.id,
        text: 'Qu\'est-ce que vous aimeriez apporter de différent dans vos futures relations ?',
        type: 'text',
        order: 3,
        isRequired: true,
      },
      {
        moduleId: module4.id,
        text: 'Comment souhaitez-vous que vos relations évoluent dans les prochaines années ?',
        type: 'text',
        order: 4,
        isRequired: true,
      },
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created 4 modules and 16 questions`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
