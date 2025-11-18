// TypeScript type definitions based on data-model.md

export interface UserProfile {
  background: string
  skill_level: SkillLevel
  learning_goal: string
}

export interface SkillLevel {
  programming_foundation?: string
  related_experience: string
  prerequisite_knowledge: string
}

export interface Roadmap {
  title: string
  user_profile: UserProfile
  roadmap: Stage[]
}

export interface Stage {
  stage: string
  stage_title: string
  stage_goal: string
  estimated_duration: string
  modules: Module[]
}

export interface Module {
  module_title: string
  module_purpose: string
  core_concepts: Concept[]
  demystification_analogy?: string
  recommended_resources?: Resource[]
}

export interface Concept {
  concept_title: string
  concept_detail: string
  detail_file?: string
}

export interface Resource {
  name: string
  description: string
  url?: string // 可以是URL或工具描述(如"手机自带录音APP")
  search_keyword?: string
  tips?: string
}

// Derived types (computed on client)
export interface StageWithProgress extends Stage {
  progress_percentage: number
  completed_modules_count: number
  total_modules_count: number
}

export interface ModuleWithMetadata extends Module {
  module_id: string
  stage_id: string
  is_bookmarked: boolean
  is_completed: boolean
}

export interface ConceptWithMetadata extends Concept {
  concept_id: string
  module_id: string
  stage_id: string
  reading_time: number
  is_bookmarked: boolean
}

// User progress types (localStorage)
export interface UserProgress {
  favorites: string[]
  completed_modules: Record<string, boolean>
  last_visited_stage: string | null
  theme: 'light' | 'dark'
}
