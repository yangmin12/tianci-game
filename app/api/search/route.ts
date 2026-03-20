
import { NextResponse } from 'next/server'
import { initWordStore, searchWords, getWordData } from '@/lib/wordStore'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }

  try {
    initWordStore()
    const words = searchWords(query, 100)
    
    const results = words.map(word =&gt; {
      const data = getWordData(word)
      return {
        word,
        length: data?.length || word.length,
        frequency: data?.frequency || 0
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
