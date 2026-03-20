
import fs from 'fs'
import path from 'path'

const INPUT_FILE = path.join(process.cwd(), 'data/words_alpha.txt')
const OUTPUT_FILE = path.join(process.cwd(), 'data/words-cleaned.json')

console.log('Starting word processing...')

const rawWords = fs.readFileSync(INPUT_FILE, 'utf-8').split('\n')
console.log(`Raw words: ${rawWords.length.toLocaleString()}`)

const wordSet = new Set<string>()

for (const word of rawWords) {
  const trimmed = word.trim().toLowerCase()
  if (
    trimmed.length >= 2 &&
    trimmed.length <= 15 &&
    /^[a-z]+$/.test(trimmed)
  ) {
    wordSet.add(trimmed)
  }
}

const cleanedWords = Array.from(wordSet).sort()
console.log(`Cleaned words: ${cleanedWords.length.toLocaleString()}`)

interface WordData {
  length: number
  frequency: number
}

const wordData: Record<string, WordData> = {}
for (const word of cleanedWords) {
  wordData[word] = {
    length: word.length,
    frequency: 1000 - word.length * 50
  }
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(wordData, null, 2))
console.log(`Written to: ${OUTPUT_FILE}`)
console.log('Done!')

