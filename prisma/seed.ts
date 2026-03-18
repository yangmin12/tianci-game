import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed the database...')

  // Sample "stupidity" related crossword clues
  const clues = [
    { clueText: 'Stupidity', answer: 'IDIOCY', length: 6, source: 'NYT', difficulty: 3, popularity: 100 },
    { clueText: 'Stupidity', answer: 'FOLLY', length: 5, source: 'LA Times', difficulty: 2, popularity: 90 },
    { clueText: 'Stupidity', answer: 'FATUITY', length: 7, source: 'NYT', difficulty: 4, popularity: 75 },
    { clueText: 'Stupidity', answer: 'INANITY', length: 7, source: 'Washington Post', difficulty: 3, popularity: 80 },
    { clueText: 'Stupidity', answer: 'DULLNESS', length: 8, source: 'NYT', difficulty: 2, popularity: 60 },
    { clueText: 'Stupidity', answer: 'NONSENSE', length: 8, source: 'LA Times', difficulty: 2, popularity: 70 },
    { clueText: 'Stupidity', answer: 'ABSURDITY', length: 9, source: 'NYT', difficulty: 3, popularity: 65 },
    { clueText: 'Stupidity', answer: 'SILLINESS', length: 9, source: 'Washington Post', difficulty: 2, popularity: 55 },
    { clueText: 'Stupidity', answer: 'FEEBLEMINDEDNESS', length: 16, source: 'NYT', difficulty: 5, popularity: 30 },
    { clueText: 'Stupidity', answer: 'BETISE', length: 6, source: 'NYT', difficulty: 4, popularity: 40 },
    { clueText: 'Folly', answer: 'IDIOCY', length: 6, source: 'NYT', difficulty: 3, popularity: 85 },
    { clueText: 'Folly', answer: 'STUPIDITY', length: 9, source: 'LA Times', difficulty: 2, popularity: 80 },
    { clueText: 'Idiocy', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 2, popularity: 88 },
    { clueText: 'Idiocy', answer: 'FOLLY', length: 5, source: 'Washington Post', difficulty: 2, popularity: 72 },
    { clueText: 'Fatuity', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 3, popularity: 50 },
    { clueText: 'Inanity', answer: 'STUPIDITY', length: 9, source: 'LA Times', difficulty: 3, popularity: 55 },
    { clueText: 'Nonsense', answer: 'DRIVEL', length: 6, source: 'NYT', difficulty: 3, popularity: 45 },
    { clueText: 'Absurdity', answer: 'NONSENSE', length: 8, source: 'Washington Post', difficulty: 2, popularity: 50 },
    { clueText: 'Silliness', answer: 'FOOLISHNESS', length: 11, source: 'NYT', difficulty: 3, popularity: 48 },
    { clueText: 'Dumbness', answer: 'STUPIDITY', length: 9, source: 'LA Times', difficulty: 2, popularity: 62 },
    { clueText: 'Lack of intelligence', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 2, popularity: 70 },
    { clueText: 'Brainlessness', answer: 'IDIOCY', length: 6, source: 'Washington Post', difficulty: 3, popularity: 40 },
    { clueText: 'Foolishness', answer: 'IDIOCY', length: 6, source: 'NYT', difficulty: 2, popularity: 75 },
    { clueText: 'Foolishness', answer: 'STUPIDITY', length: 9, source: 'LA Times', difficulty: 2, popularity: 78 },
    { clueText: 'Foolish action', answer: 'BETISE', length: 6, source: 'NYT', difficulty: 4, popularity: 35 },
    { clueText: 'Senselessness', answer: 'INANITY', length: 7, source: 'Washington Post', difficulty: 3, popularity: 42 },
    { clueText: 'Asininity', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 4, popularity: 38 },
    { clueText: 'Dim-wittedness', answer: 'STUPIDITY', length: 9, source: 'LA Times', difficulty: 3, popularity: 45 },
    { clueText: 'Gullibility', answer: 'NAIVETE', length: 7, source: 'NYT', difficulty: 3, popularity: 50 },
    { clueText: 'Simple-mindedness', answer: 'STUPIDITY', length: 9, source: 'Washington Post', difficulty: 3, popularity: 48 },
    { clueText: 'Thickness', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 3, popularity: 35 },
    { clueText: 'Denseness', answer: 'STUPIDITY', length: 9, source: 'LA Times', difficulty: 3, popularity: 38 },
    { clueText: 'Obtuseness', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 4, popularity: 40 },
    { clueText: 'Dull-wittedness', answer: 'IDIOCY', length: 6, source: 'Washington Post', difficulty: 3, popularity: 42 },
    { clueText: 'Vacuity', answer: 'EMPTY', length: 5, source: 'NYT', difficulty: 3, popularity: 30 },
    { clueText: 'Vacuity', answer: 'VOID', length: 4, source: 'LA Times', difficulty: 2, popularity: 35 },
    { clueText: 'Mindlessness', answer: 'IDIOCY', length: 6, source: 'NYT', difficulty: 3, popularity: 45 },
    { clueText: 'Imbecility', answer: 'IDIOCY', length: 6, source: 'Washington Post', difficulty: 4, popularity: 40 },
    { clueText: 'Moronism', answer: 'STUPIDITY', length: 9, source: 'NYT', difficulty: 4, popularity: 30 },
    { clueText: 'Idiotic behavior', answer: 'BETISE', length: 6, source: 'LA Times', difficulty: 4, popularity: 32 },
  ]

  // Create clues in database
  for (const clue of clues) {
    await prisma.clue.create({
      data: clue,
    })
  }

  // Add synonyms for some clues
  const createdClues = await prisma.clue.findMany()
  
  // Create synonyms for stupidity answers
  const stupidityAnswers = ['IDIOCY', 'FOLLY', 'FATUITY', 'INANITY', 'DULLNESS', 'NONSENSE', 'ABSURDITY', 'SILLINESS']
  
  for (const clue of createdClues) {
    if (clue.clueText === 'Stupidity') {
      // Add synonyms
      const synonyms = stupidityAnswers.filter(a => a !== clue.answer)
      
      for (const synonym of synonyms) {
        await prisma.clueSynonym.create({
          data: {
            clueId: clue.id,
            synonym: synonym,
            relationshipType: synonym.length === clue.length ? 'exact' : 'related',
          },
        })
      }
    }
  }

  console.log(`✅ Seeded ${clues.length} clues!`)
  console.log('🌱 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
