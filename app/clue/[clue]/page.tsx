'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ClueData {
  clueText: string
  answers: Array<{
    answer: string
    length: number
    source?: string
    popularity: number
  }>
  synonyms: string[]
  relatedClues: Array<{
    clueText: string
    answer: string
    length: number
  }>
}

export default function CluePage({ params }: { params: { clue: string } }) {
  const [data, setData] = useState<ClueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const decodedClue = decodeURIComponent(params.clue)

  useEffect(() => {
    fetch(`/api/clue/${encodeURIComponent(decodedClue)}`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [decodedClue])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/clue/${encodeURIComponent(searchQuery.trim().toLowerCase())}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  const mainAnswer = data?.answers[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Search */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Crossword Solver
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for another clue..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-full focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full hover:bg-indigo-700 text-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 capitalize">{decodedClue}</span>
        </nav>

        {mainAnswer ? (
          <>
            {/* Main Answer Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
              <p className="text-gray-600 mb-2">Answer for:</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 capitalize">
                "{decodedClue}"
              </h1>
              
              <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl px-12 py-8 mb-4">
                <div className="text-5xl md:text-6xl font-bold tracking-wider">
                  {mainAnswer.answer}
                </div>
                <div className="text-lg mt-2 opacity-90">
                  ({mainAnswer.length} letters)
                </div>
              </div>

              {mainAnswer.source && (
                <p className="text-gray-500 text-sm">
                  From: {mainAnswer.source}
                </p>
              )}
            </div>

            {/* Other Possible Answers */}
            {data?.answers.length > 1 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Other Possible Answers
                </h2>
                <div className="space-y-2">
                  {data.answers.slice(1).map((ans, idx) => (
                    <Link
                      key={idx}
                      href={`/answer/${encodeURIComponent(ans.answer.toLowerCase())}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{ans.answer}</span>
                        <span className="text-sm text-gray-500">{ans.length} letters</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {data?.synonyms.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Synonyms & Related Words
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.synonyms.map((synonym, idx) => (
                    <Link
                      key={idx}
                      href={`/clue/${encodeURIComponent(synonym.toLowerCase())}`}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {synonym}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Clues */}
            {data?.relatedClues.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  You Might Also Like
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {data.relatedClues.map((clue, idx) => (
                    <Link
                      key={idx}
                      href={`/clue/${encodeURIComponent(clue.clueText.toLowerCase())}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-gray-900 font-medium capitalize">{clue.clueText}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {clue.answer} ({clue.length} letters)
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Answer Found */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No answer found for "{decodedClue}"
            </h1>
            <p className="text-gray-600 mb-6">
              Try searching with different wording, or browse by letter or length.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go Home
              </Link>
              <Link
                href="/letter/a"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Browse by Letter
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2026 Crossword Solver. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
