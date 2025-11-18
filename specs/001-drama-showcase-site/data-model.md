# Data Model: 短剧展示静态网站

**Feature**: 001-drama-showcase-site
**Date**: 2025-11-18
**Source**: duanju.json (374.5KB, 902 lines)

---

## Overview

本数据模型基于duanju.json文件的结构设计,所有实体和字段严格对应JSON schema。数据模型采用树状层级结构:Roadmap → Stage → Module → Concept → Resource。

---

## Entity Relationships

```
Roadmap (1)
├── UserProfile (1)
└── Stage (1..n)
    └── Module (1..n)
        ├── Concept (1..n)
        └── Resource (0..n)

UserProgress (client-side only)
├── favorites (n)
└── completedModules (n)
```

---

## Entities

### 1. Roadmap (学习路线图)

**Purpose**: 表示整个学习路线图的顶层数据结构

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `title` | string | Yes | 路线图标题 | Min: 1, Max: 200 |
| `user_profile` | UserProfile | Yes | 目标用户画像 | Object |
| `roadmap` | Stage[] | Yes | 学习阶段数组 | Min length: 1 |

**Example**:
```json
{
  "title": "针对教师背景的短剧剧本写作变现学习路线图",
  "user_profile": { /* UserProfile */ },
  "roadmap": [ /* Stage[] */ ]
}
```

**Validation Rules**:
- `title`不能为空
- `roadmap`数组至少包含1个阶段
- `user_profile`必须包含background, skill_level, learning_goal字段

---

### 2. UserProfile (用户画像)

**Purpose**: 描述目标用户的背景、技能水平和学习目标

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `background` | string | Yes | 用户背景描述 | Min: 1 |
| `skill_level` | SkillLevel | Yes | 技能水平对象 | Object |
| `learning_goal` | string | Yes | 学习目标 | Min: 1 |

**SkillLevel sub-entity**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `programming_foundation` | string | No | 编程基础 |
| `related_experience` | string | Yes | 相关经验 |
| `prerequisite_knowledge` | string | Yes | 前置知识 |

**Example**:
```json
{
  "background": "教师,擅长教学设计、节奏把控和受众心理理解",
  "skill_level": {
    "programming_foundation": "不适用",
    "related_experience": "有随笔写作习惯,具备文字表达能力",
    "prerequisite_knowledge": "缺乏短剧专业知识"
  },
  "learning_goal": "将短剧剧本写作发展为副业,能够向短剧平台投稿并获得稿费收入"
}
```

---

### 3. Stage (学习阶段)

**Purpose**: 表示学习路线图的一个阶段,包含多个学习模块

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `stage` | string | Yes | 阶段编号 | Pattern: "^[0-9]+$" |
| `stage_title` | string | Yes | 阶段标题 | Min: 1, Max: 100 |
| `stage_goal` | string | Yes | 阶段目标 | Min: 1 |
| `estimated_duration` | string | Yes | 预估时长 | Pattern: "[0-9]+-[0-9]+周" |
| `modules` | Module[] | Yes | 模块数组 | Min length: 1 |

**Example**:
```json
{
  "stage": "1",
  "stage_title": "行业认知与思维转换",
  "stage_goal": "了解短剧行业生态和变现逻辑,建立从散文写作到视觉化剧本创作的思维转换",
  "estimated_duration": "2-3周",
  "modules": [ /* Module[] */ ]
}
```

**Derived Fields** (computed on client):
- `progress_percentage`: number (0-100,基于UserProgress计算)
- `completed_modules_count`: number
- `total_modules_count`: number

---

### 4. Module (学习模块)

**Purpose**: 表示某个阶段内的一个学习模块,包含核心概念和推荐资源

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `module_title` | string | Yes | 模块标题 | Min: 1, Max: 100 |
| `module_purpose` | string | Yes | 模块目的 | Min: 1 |
| `core_concepts` | Concept[] | Yes | 核心概念数组 | Min length: 1 |
| `demystification_analogy` | string | No | 去神秘化类比 | - |
| `recommended_resources` | Resource[] | No | 推荐资源数组 | - |

**Example**:
```json
{
  "module_title": "短剧行业生态与商业模式",
  "module_purpose": "理解短剧市场的运作机制和变现路径...",
  "core_concepts": [ /* Concept[] */ ],
  "demystification_analogy": "就像你作为教师要了解教育体制...",
  "recommended_resources": [ /* Resource[] */ ]
}
```

**Derived Fields** (computed on client):
- `module_id`: string (generated as `${stage}-${index}`)
- `is_bookmarked`: boolean
- `is_completed`: boolean

---

### 5. Concept (核心概念)

**Purpose**: 表示某个模块内的一个核心概念,包含详细说明

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `concept_title` | string | Yes | 概念标题 | Min: 1, Max: 200 |
| `concept_detail` | string | Yes | 概念详细说明(Markdown) | Min: 1 |
| `detail_file` | string | No | 详情文件引用 | - |

**Example**:
```json
{
  "concept_title": "短剧产业链条(编剧-制作-平台-观众)",
  "concept_detail": "## 1. 短剧产业链条\n\n### 核心定义\n...",
  "detail_file": "concepts_stage1_module1.md"
}
```

**Derived Fields** (computed on client):
- `concept_id`: string (generated as `${stage}-${module}-${index}`)
- `reading_time`: number (estimated in minutes, based on word count)
- `is_bookmarked`: boolean

**Markdown Structure** (inside concept_detail):
The `concept_detail` field contains Markdown with the following structure:
- `## [序号]. [概念标题]`
- `### 核心定义`
- `### 核心比喻`
- `### 工作原理`
- `### 现实世界应用案例`
- `### 优点与局限性`
- `### 常见误解/陷阱`
- `### 学习路径`
- `### 总结`

---

### 6. Resource (推荐资源)

**Purpose**: 表示学习资源,包含名称、描述和链接

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `name` | string | Yes | 资源名称 | Min: 1 |
| `description` | string | Yes | 资源描述 | Min: 1 |
| `url` | string | No | 资源链接 | Format: URL or search keyword |
| `search_keyword` | string | No | 搜索关键词 | - |

**Example**:
```json
{
  "name": "剧本超市公众号",
  "description": "行业资讯和剧本交易信息",
  "url": "https://mp.weixin.qq.com/",
  "search_keyword": "剧本超市"
}
```

**Validation Rules**:
- `url`或`search_keyword`至少提供一个
- 如果`url`存在,必须是有效的URL格式

---

### 7. UserProgress (用户进度) - Client-Side Only

**Purpose**: 存储在localStorage中的用户学习进度和收藏数据

**Fields**:

| Field | Type | Required | Description | Storage |
|-------|------|----------|-------------|---------|
| `favorites` | string[] | Yes | 收藏的模块/概念ID数组 | localStorage |
| `completed_modules` | Record<string, boolean> | Yes | 已完成的模块映射 | localStorage |
| `last_visited_stage` | string | No | 最后访问的阶段ID | localStorage |
| `theme` | 'light' \| 'dark' | No | 主题偏好 | localStorage |

**Example**:
```json
{
  "favorites": ["1-0", "2-1", "concept-1-0-2"],
  "completed_modules": {
    "1-0": true,
    "1-1": false,
    "2-0": true
  },
  "last_visited_stage": "2",
  "theme": "dark"
}
```

**localStorage Key**: `learning-short-drama-storage`

**State Management** (Zustand):
```typescript
interface UserProgressState {
  favorites: string[]
  completed_modules: Record<string, boolean>
  last_visited_stage: string | null
  theme: 'light' | 'dark'

  // Actions
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (id: string) => void
  markAsCompleted: (moduleId: string, completed: boolean) => void
  setLastVisitedStage: (stageId: string) => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

---

## TypeScript Type Definitions

```typescript
// src/types/roadmap.ts

export interface Roadmap {
  title: string
  user_profile: UserProfile
  roadmap: Stage[]
}

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
  url?: string
  search_keyword?: string
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

// User progress types
export interface UserProgress {
  favorites: string[]
  completed_modules: Record<string, boolean>
  last_visited_stage: string | null
  theme: 'light' | 'dark'
}
```

---

## Data Transformations

### 1. ID Generation

```typescript
// Generate unique IDs for modules and concepts
function generateModuleId(stageId: string, moduleIndex: number): string {
  return `${stageId}-${moduleIndex}`
}

function generateConceptId(
  stageId: string,
  moduleIndex: number,
  conceptIndex: number
): string {
  return `${stageId}-${moduleIndex}-${conceptIndex}`
}
```

### 2. Progress Calculation

```typescript
function calculateStageProgress(
  stage: Stage,
  completedModules: Record<string, boolean>
): number {
  const totalModules = stage.modules.length
  const completedCount = stage.modules.filter((_, index) => {
    const moduleId = `${stage.stage}-${index}`
    return completedModules[moduleId]
  }).length

  return Math.round((completedCount / totalModules) * 100)
}
```

### 3. Reading Time Estimation

```typescript
// Estimate reading time based on Chinese character count
function estimateReadingTime(markdown: string): number {
  const chineseCharsCount = (markdown.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWordsCount = (markdown.match(/[a-zA-Z]+/g) || []).length

  // Average reading speed: 300 Chinese chars/min, 200 English words/min
  const chineseTime = chineseCharsCount / 300
  const englishTime = englishWordsCount / 200

  return Math.ceil(chineseTime + englishTime)
}
```

---

## Data Loading Strategy

### Option 1: Full Load (Current)
```typescript
// Load entire duanju.json at once
import data from '@/data/duanju.json'

// Pros: Simple, no additional requests
// Cons: 374KB initial load, may impact LCP
```

### Option 2: Lazy Load by Stage
```typescript
// Split duanju.json into stage-specific files
async function loadStageData(stageId: string): Promise<Stage> {
  const module = await import(`@/data/stages/stage-${stageId}.json`)
  return module.default
}

// Pros: Smaller initial load, better performance
// Cons: More complex build process, multiple requests
```

### Option 3: IndexedDB Caching
```typescript
// Cache full data in IndexedDB after first load
import Dexie from 'dexie'

class RoadmapDB extends Dexie {
  stages!: Dexie.Table<Stage, string>

  constructor() {
    super('LearningRoadmapDB')
    this.version(1).stores({
      stages: 'stage'
    })
  }
}

const db = new RoadmapDB()

async function loadData(): Promise<Roadmap> {
  // Try IndexedDB first
  const cachedStages = await db.stages.toArray()
  if (cachedStages.length > 0) {
    return { /* reconstruct Roadmap */ }
  }

  // Fallback to network
  const data = await fetch('/data/duanju.json').then(r => r.json())
  await db.stages.bulkPut(data.roadmap)
  return data
}

// Pros: Fastest subsequent loads, offline support
// Cons: More complex, requires IndexedDB support
```

**Recommendation**: Start with Option 1 (Full Load) for MVP, optimize with Option 2 or 3 if performance metrics fall short.

---

## Validation Schema (Zod)

```typescript
import { z } from 'zod'

const UserProfileSchema = z.object({
  background: z.string().min(1),
  skill_level: z.object({
    programming_foundation: z.string().optional(),
    related_experience: z.string().min(1),
    prerequisite_knowledge: z.string().min(1)
  }),
  learning_goal: z.string().min(1)
})

const ConceptSchema = z.object({
  concept_title: z.string().min(1).max(200),
  concept_detail: z.string().min(1),
  detail_file: z.string().optional()
})

const ResourceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().optional(),
  search_keyword: z.string().optional()
}).refine(
  data => data.url || data.search_keyword,
  { message: "Either url or search_keyword must be provided" }
)

const ModuleSchema = z.object({
  module_title: z.string().min(1).max(100),
  module_purpose: z.string().min(1),
  core_concepts: z.array(ConceptSchema).min(1),
  demystification_analogy: z.string().optional(),
  recommended_resources: z.array(ResourceSchema).optional()
})

const StageSchema = z.object({
  stage: z.string().regex(/^[0-9]+$/),
  stage_title: z.string().min(1).max(100),
  stage_goal: z.string().min(1),
  estimated_duration: z.string().regex(/[0-9]+-[0-9]+周/),
  modules: z.array(ModuleSchema).min(1)
})

export const RoadmapSchema = z.object({
  title: z.string().min(1).max(200),
  user_profile: UserProfileSchema,
  roadmap: z.array(StageSchema).min(1)
})

// Usage
import duanjuData from '@/data/duanju.json'

try {
  const validatedData = RoadmapSchema.parse(duanjuData)
  console.log('✅ Data validation passed')
} catch (error) {
  console.error('❌ Data validation failed:', error)
}
```

---

## Summary

- **Total Entities**: 7 (6 from JSON + 1 client-side)
- **Root Entity**: Roadmap
- **Max Depth**: 4 levels (Roadmap → Stage → Module → Concept)
- **Data Source**: duanju.json (374.5KB)
- **Client Storage**: localStorage (UserProgress)
- **Validation**: Zod schema
- **Type Safety**: Full TypeScript definitions

本数据模型设计确保了:
1. 与duanju.json严格对应,无额外映射
2. 类型安全,通过TypeScript和Zod双重验证
3. 性能优化,支持多种加载策略
4. 可扩展性,预留derived fields和metadata
