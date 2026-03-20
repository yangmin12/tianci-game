import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { clue: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const decodedClue = decodeURIComponent(params.clue)
  
  return {
    title: `${decodedClue.charAt(0).toUpperCase() + decodedClue.slice(1)} - Crossword Clue Answer`,
    description: `Answer for the crossword clue "${decodedClue}". Find the most likely answer and other possible solutions.`,
    openGraph: {
      title: `${decodedClue.charAt(0).toUpperCase() + decodedClue.slice(1)} - Crossword Clue Answer`,
      description: `Answer for the crossword clue "${decodedClue}". Find the most likely answer and other possible solutions.`,
      type: 'website',
    },
  }
}

export default function ClueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
