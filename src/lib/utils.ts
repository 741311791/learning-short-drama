import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Used throughout the app for conditional styling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate unique module ID from stage ID and module index
 * Format: "stageId-moduleIndex" (e.g., "1-0", "2-3")
 */
export function generateModuleId(stageId: string, moduleIndex: number): string {
  return `${stageId}-${moduleIndex}`
}

/**
 * Generate unique concept ID from stage ID, module index, and concept index
 * Format: "stageId-moduleIndex-conceptIndex" (e.g., "1-0-2", "3-1-5")
 */
export function generateConceptId(
  stageId: string,
  moduleIndex: number,
  conceptIndex: number
): string {
  return `${stageId}-${moduleIndex}-${conceptIndex}`
}

/**
 * Estimate reading time for Markdown content
 * Based on average reading speed: 300 Chinese chars/min, 200 English words/min
 * Returns estimated reading time in minutes (rounded up)
 */
export function estimateReadingTime(markdown: string): number {
  // Count Chinese characters
  const chineseChars = (markdown.match(/[\u4e00-\u9fa5]/g) || []).length

  // Count English words
  const englishWords = (markdown.match(/[a-zA-Z]+/g) || []).length

  // Calculate time based on reading speeds
  const chineseTime = chineseChars / 300 // 300 chars/min
  const englishTime = englishWords / 200 // 200 words/min

  return Math.ceil(chineseTime + englishTime)
}
