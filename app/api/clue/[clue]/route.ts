import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { clue: string } }
) {
  const clueText = decodeURIComponent(params.clue).toLowerCase()

  try {
    // Find clues matching the search text
    const clues = await prisma.clue.findMany({
      where: {
        clueText: {
          contains: clueText,
          mode: 'insensitive',
        },
      },
      include: {
        synonyms: true,
      },
      orderBy: [
        { popularity: 'desc' },
        { length: 'asc' },
      ],
    })

    if (clues.length === 0) {
      // If no exact match, try pattern search or return empty
      return NextResponse.json({
        clueText: clueText,
        answers: [],
        synonyms: [],
        relatedClues: [],
      })
    }

    // Get unique answers sorted by popularity
    const answers = Array.from(
      new Map(clues.map(clue => [clue.answer, clue])).values()
    ).map(clue => ({
      answer: clue.answer.toUpperCase(),
      length: clue.length,
      source: clue.source,
      popularity: clue.popularity,
    }))

    // Collect synonyms
    const synonyms = Array.from(
      new Set(clues.flatMap(clue => clue.synonyms.map(s => s.synonym)))
    ).slice(0, 10)

    // Find related clues (same length or similar answers)
    const relatedClues = await prisma.clue.findMany({
      where: {
        AND: [
          {
            OR: [
              { length: clues[0].length },
              { answer: { in: answers.map(a => a.answer.toLowerCase()) } },
            ],
          },
          {
            clueText: {
              not: {
                contains: clueText,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      take: 6,
      orderBy: { popularity: 'desc' },
    })

    return NextResponse.json({
      clueText: clueText,
      answers,
      synonyms,
      relatedClues: relatedClues.map(clue => ({
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
