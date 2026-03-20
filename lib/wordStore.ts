
import fs from 'fs'
import path from 'path'

interface WordData {
  length: number
  frequency: number
}

let wordStore: Record<string, WordData> | null = null
let wordList: string[] | null = null

export function initWordStore() {
  if (wordStore) return

  const dataPath = path.join(process.cwd(), 'data/words-cleaned.json')
  if (!fs.existsSync(dataPath)) {
    throw new Error('Word data not found. Run process-words.ts first.')
  }

  wordStore = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  wordList = Object.keys(wordStore as Record<string, WordData>).sort((a, b) => {
    const aData = wordStore![a]
    const bData = wordStore![b]
    if (aData.length !== bData.length) return aData.length - bData.length
    return bData.frequency - aData.frequency
  })

  console.log(`Word store initialized with ${wordList.length.toLocaleString()} words`)
}

export function searchWords(pattern: string, limit = 100): string[] {
  if (!wordStore || !wordList) {
    initWordStore()
  }

  let regexPattern = pattern
    .toLowerCase()
    .replace(/\?/g, '.')
    .replace(/_/g, '.')
    .replace(/\*/g, '.*')
    .replace(/\s+/g, '.*')

  if (!regexPattern.includes('.') && !regexPattern.includes('*')) {
    regexPattern = `.*${regexPattern}.*`
  }

  if (!regexPattern.startsWith('^')) regexPattern = `^${regexPattern}`
  if (!regexPattern.endsWith('$')) regexPattern = `${regexPattern}$`

  try {
    const regex = new RegExp(regexPattern)
    const results: string[] = []

    for (const word of wordList!) {
      if (regex.test(word)) {
        results.push(word)
        if (results.length >= limit) break
      }
    }

    return results
  } catch (e) {
    console.error('Regex error:', e)
    return []
  }
}

export function getWordData(word: string): WordData | null {
  if (!wordStore) initWordStore()
  return wordStore![word.toLowerCase()] || null
}

