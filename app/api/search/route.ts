import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim().toLowerCase()
  const length = searchParams.get('length')
  const pattern = searchParams.get('pattern')

  if (!query && !pattern) {
    return NextResponse.json({ error: 'Query or pattern required' }, { status: 400 })
  }

  try {
    let whereClause: any = {}

    if (query) {
      // Search by clue text or answer
      whereClause.OR = [
        { clueText: { contains: query, mode: 'insensitive' } },
        { answer: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (length) {
      whereClause.length = parseInt(length)
    }

    if (pattern) {
      // Pattern search: convert I____Y to I____Y (SQL LIKE pattern)
      let sqlPattern = pattern.toUpperCase()
      sqlPattern = sqlPattern.replace(/_/g, '_')
      sqlPattern = sqlPattern.replace(/\?/g, '_')
      whereClause.answer = { like: sqlPattern }
    }

    const clues = await prisma.clue.findMany({
      where: whereClause,
      include: {
        synonyms: true,
      },
      orderBy: [
        { popularity: 'desc' },
        { length: 'asc' },
      ],
      take: 50,
    })

    // Group by answer to avoid duplicates
    const groupedByAnswer: Record<string, any[]> = {}
    for (const clue of clues) {
      const answerUpper = clue.answer.toUpperCase()
      if (!groupedByAnswer[answerUpper]) {
        groupedByAnswer[answerUpper] = []
      }
      groupedByAnswer[answerUpper].push(clue)
    }

    const results = Object.entries(groupedByAnswer).map(([answer, clueList]) => ({
      answer,
      length: clueList[0].length,
      clues: clueList.map(c => ({
        id: c.id,
        clueText: c.clueText,
        source: c.source,
        difficulty: c.difficulty,
        popularity: c.popularity,
      })),
      synonyms: clueList[0].synonyms?.map(s => s.synonym) || [],
    }))

    return NextResponse.json({
      query,
      pattern,
      length: length ? parseInt(length) : null,
      results,
      total: results.length,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
