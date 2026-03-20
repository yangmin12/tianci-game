'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/clue/${encodeURIComponent(searchQuery.trim().toLowerCase())}`)
    }
  }

  // Display search query with spaces replaced by ? for better user perception
  const displayQuery = searchQuery.replace(/ /g, '?')

  const popularSearches = [
    'Stupidity',
    'Folly',
    'Idiocy',
    'Nonsense',
    'Absurdity',
  ]

  const letterLinks = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const lengthLinks = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Crossword Solver
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link href="/length" className="text-gray-600 hover:text-indigo-600">By Length</Link>
            <Link href="/letter" className="text-gray-600 hover:text-indigo-600">By Letter</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Crossword Clue Answers Fast
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The easiest way to solve crossword puzzles. Search by clue, pattern, or length.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a crossword clue, e.g., 'Stupidity' or use spaces for wildcards: 'D G'"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-indigo-500 focus:outline-none shadow-lg"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-8 py-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </div>
            {/* Visual feedback for spaces */}
            {searchQuery && searchQuery.includes(' ') && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  Searching for: <span className="font-mono text-lg text-indigo-600 font-bold">{displayQuery}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Spaces represent unknown letters (use ? or _ as well)
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Quick Search Tips */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wildcard Search Guide</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-indigo-600">Single Character: ? or _</p>
              <p className="text-gray-600">Use <code>?</code> or <code>_</code> for one unknown letter</p>
              <p className="text-xs text-gray-500 mt-1">Example: <code>d?g</code> → dog, dig, dug</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-indigo-600">Multiple Characters: * or space</p>
              <p className="text-gray-600">Use <code>*</code> or space for any number of letters</p>
              <p className="text-xs text-gray-500 mt-1">Example: <code>d*g</code> → dog, drag, doing</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-indigo-600">Contains Word</p>
              <p className="text-gray-600">Wrap with <code>*</code> to find containing words</p>
              <p className="text-xs text-gray-500 mt-1">Example: <code>*love*</code> → love, lover, beloved</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-indigo-600">Exact Length</p>
              <p className="text-gray-600">Use multiple <code>?</code> for exact length</p>
              <p className="text-xs text-gray-500 mt-1">Example: <code>????</code> → any 4-letter word</p>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((search) => (
              <Link
                key={search}
                href={`/clue/${encodeURIComponent(search.toLowerCase())}`}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>

        {/* Browse Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* By Length */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Length</h2>
            <div className="flex flex-wrap gap-2">
              {lengthLinks.map((length) => (
                <Link
                  key={length}
                  href={`/length/${length}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {length} letters
                </Link>
              ))}
            </div>
          </div>

          {/* By Letter */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Letter</h2>
            <div className="flex flex-wrap gap-2">
              {letterLinks.map((letter) => (
                <Link
                  key={letter}
                  href={`/letter/${letter.toLowerCase()}`}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  {letter}
                </Link>
              ))}
            </div>
          </div>
        </div>
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
