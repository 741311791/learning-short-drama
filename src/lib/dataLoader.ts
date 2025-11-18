import { Roadmap, Stage } from '@/types/roadmap'
import { RoadmapSchema } from '@/lib/validation'

/**
 * Load complete roadmap data from duanju.json
 * Includes caching and validation logic
 */
export async function loadRoadmapData(): Promise<{
  success: boolean
  data?: Roadmap
  error?: string
}> {
  try {
    // Fetch from network
    const response = await fetch('/data/duanju.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const rawData = await response.json()

    // Validate with Zod
    const validatedData = RoadmapSchema.parse(rawData)

    return { success: true, data: validatedData }
  } catch (error) {
    console.error('Failed to load roadmap data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Load specific stage by ID
 * Returns stage data from the complete roadmap
 */
export async function loadStageById(stageId: string): Promise<{
  success: boolean
  data?: Stage
  error?: string
}> {
  try {
    const { data: roadmap } = await loadRoadmapData()
    if (!roadmap) {
      throw new Error('Roadmap data not loaded')
    }

    const stage = roadmap.roadmap.find((s) => s.stage === stageId)
    if (!stage) {
      throw new Error(`Stage ${stageId} not found`)
    }

    return { success: true, data: stage }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
