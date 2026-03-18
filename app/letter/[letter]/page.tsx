
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const revalidate = 3600

export default async function LetterPage({ params }: { params: { letter: string } }) {
  const letter = params.letter.toLowerCase()

  const clues = await prisma.clue.findMany({
    where: {
      clueText: {
        startsWith: letter,
        mode: 'insensitive',
      },
    },
    take: 100,
    orderBy: [
      { popularity: 'desc' },
      { clueText: 'asc' },
    ],
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Crossword Solver
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 uppercase">{letter}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Crossword Clues Starting with "{letter.toUpperCase()}"
        </h1>

        {clues.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid gap-3">
              {clues.map((clue, idx) => (
                <Link
                  key={idx}
                  href={`/clue/${encodeURIComponent(clue.clueText.toLowerCase())}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 capitalize">{clue.clueText}</span>
                    <span className="text-sm text-gray-500">{clue.answer.toUpperCase()} ({clue.length})</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">No clues found starting with "{letter}".</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2026 Crossword Solver. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
