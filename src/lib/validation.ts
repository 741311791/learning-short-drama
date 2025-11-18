import { z } from 'zod'

// Zod validation schemas based on data-model.md

export const SkillLevelSchema = z.object({
  programming_foundation: z.string().optional(),
  related_experience: z.string().min(1),
  prerequisite_knowledge: z.string().min(1),
})

export const UserProfileSchema = z.object({
  background: z.string().min(1),
  skill_level: SkillLevelSchema,
  learning_goal: z.string().min(1),
})

export const ResourceSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    url: z.string().optional(), // 允许任意字符串,包括URL和工具描述
    search_keyword: z.string().optional(),
    tips: z.string().optional(), // 支持tips字段
  })
  .refine((data) => data.url || data.search_keyword, {
    message: 'Either url or search_keyword must be provided',
  })

export const ConceptSchema = z.object({
  concept_title: z.string().min(1).max(200),
  concept_detail: z.string().min(1),
  detail_file: z.string().optional(),
})

export const ModuleSchema = z.object({
  module_title: z.string().min(1).max(100),
  module_purpose: z.string().min(1),
  core_concepts: z.array(ConceptSchema).min(1),
  demystification_analogy: z.string().optional(),
  recommended_resources: z.array(ResourceSchema).optional(),
})

export const StageSchema = z.object({
  stage: z.string().regex(/^[0-9]+$/),
  stage_title: z.string().min(1).max(100),
  stage_goal: z.string().min(1),
  estimated_duration: z.string().regex(/[0-9]+-[0-9]+周/),
  modules: z.array(ModuleSchema).min(1),
})

export const RoadmapSchema = z.object({
  title: z.string().min(1).max(200),
  user_profile: UserProfileSchema,
  roadmap: z.array(StageSchema).min(1),
})
