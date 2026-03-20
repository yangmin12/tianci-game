
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { initWordStore, searchWords, getWordData } from '@/lib/wordStore'

export async function GET(
  request: Request,
  { params }: { params: { clue: string } }
) {
  const searchQuery = decodeURIComponent(params.clue).toLowerCase()

  try {
    initWordStore()

    // First try the database for crossword clues
    const allClues = await prisma.clue.findMany({
      include: {
        synonyms: true,
      },
      orderBy: [
        { popularity: 'desc' },
        { length: 'asc' },
      ],
    })

    const hasWildcards = searchQuery.includes('?') || searchQuery.includes('_') || searchQuery.includes(' ')
    
    let matchingClues: typeof allClues = []

    if (hasWildcards) {
      const pattern = searchQuery.replace(/[?_\s]/g, '.').toUpperCase()
      const regex = new RegExp(`^${pattern}$`, 'i')
      
      matchingClues = allClues.filter(clue =&gt; regex.test(clue.answer))
    } else {
      const searchUpper = searchQuery.toUpperCase()
      
      matchingClues = allClues.filter(clue =&gt; {
        const answerUpper = clue.answer.toUpperCase()
        const clueTextUpper = clue.clueText.toUpperCase()
        return answerUpper.includes(searchUpper) || clueTextUpper.includes(searchUpper)
      })
    }

    // Get database answers
    const dbAnswers = Array.from(
      new Map(matchingClues.map(clue =&gt; [clue.answer, clue])).values()
    ).map(clue =&gt; ({
      answer: clue.answer.toUpperCase(),
      length: clue.length,
      source: clue.source,
      popularity: clue.popularity,
    }))

    // Also get words from our big word list for pattern matching
    const wordMatches = searchWords(searchQuery, 50)
    const wordAnswers = wordMatches
      .filter(word =&gt; !dbAnswers.some(a =&gt; a.answer.toLowerCase() === word))
      .map(word =&gt; {
        const data = getWordData(word)
        return {
          answer: word.toUpperCase(),
          length: data?.length || word.length,
          source: 'Word Dictionary',
          popularity: data?.frequency || 0,
        }
      })

    // Combine and deduplicate
    const allAnswers = [...dbAnswers, ...wordAnswers]

    // Collect synonyms
    const synonyms = Array.from(
      new Set(matchingClues.flatMap(clue =&gt; clue.synonyms.map(s =&gt; s.synonym)))
    ).slice(0, 10)

    // Find related clues
    let relatedClues: any[] = []
    if (matchingClues.length &gt; 0) {
      relatedClues = await prisma.clue.findMany({
        where: {
          AND: [
            {
              OR: [
                { length: matchingClues[0].length },
                { answer: { in: dbAnswers.map(a =&gt; a.answer.toLowerCase()) } },
              ],
            },
            {
              NOT: matchingClues.map(c =&gt; ({ id: c.id })),
            },
          ],
        },
        take: 6,
        orderBy: { popularity: 'desc' },
      })
    }

    return NextResponse.json({
      clueText: searchQuery,
      answers: allAnswers,
      synonyms,
      relatedClues: relatedClues.map(clue =&gt; ({
        clueText: clue.clueText,
        answer: clue.answer.toUpperCase(),
        length: clue.length,
      })),
    })
  } catch (error) {
    console.error('Error fetching clue:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
