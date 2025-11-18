# Data Operations Contract

**Feature**: 001-drama-showcase-site
**Type**: Client-side Data Operations
**Date**: 2025-11-18

---

## Overview

本合约定义了前端应用的所有数据操作接口。由于项目是纯静态网站,无后端API,所有操作均在客户端完成:
- **数据读取**: 从duanju.json加载
- **数据搜索**: FlexSearch客户端搜索
- **用户数据**: localStorage存储

---

## 1. Data Loading Operations

### 1.1 Load Complete Roadmap

**Operation**: `loadRoadmapData()`

**Input**: None

**Output**:
```typescript
{
  success: boolean
  data?: Roadmap
  error?: string
}
```

**Behavior**:
1. 尝试从IndexedDB缓存读取
2. 如果缓存未命中,从`/data/duanju.json`加载
3. 验证数据schema (Zod)
4. 存入IndexedDB缓存
5. 返回验证后的数据

**Error Handling**:
- Network error → Display error message with retry button
- Validation error → Log to console, use fallback empty data
- Parse error → Display "数据格式错误" message

**Implementation**:
```typescript
import { RoadmapSchema } from '@/types/roadmap'
import type { Roadmap } from '@/types/roadmap'

export async function loadRoadmapData(): Promise<{
  success: boolean
  data?: Roadmap
  error?: string
}> {
  try {
    // Try IndexedDB cache first
    const cached = await db.roadmap.get('current')
    if (cached && Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return { success: true, data: cached.data }
    }

    // Fetch from network
    const response = await fetch('/data/duanju.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const rawData = await response.json()

    // Validate with Zod
    const validatedData = RoadmapSchema.parse(rawData)

    // Cache in IndexedDB
    await db.roadmap.put({
      id: 'current',
      data: validatedData,
      timestamp: Date.now()
    })

    return { success: true, data: validatedData }
  } catch (error) {
    console.error('Failed to load roadmap data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

---

### 1.2 Load Stage by ID

**Operation**: `loadStageById(stageId: string)`

**Input**:
```typescript
{
  stageId: string // e.g., "1", "2", "3"
}
```

**Output**:
```typescript
{
  success: boolean
  data?: Stage
  error?: string
}
```

**Behavior**:
1. 从完整roadmap数据中查找指定阶段
2. 如果启用分片加载,从`/data/stages/stage-${stageId}.json`加载
3. 返回Stage数据

**Implementation**:
```typescript
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

    const stage = roadmap.roadmap.find(s => s.stage === stageId)
    if (!stage) {
      throw new Error(`Stage ${stageId} not found`)
    }

    return { success: true, data: stage }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

---

## 2. Search Operations

### 2.1 Search All Content

**Operation**: `searchContent(query: string, options?: SearchOptions)`

**Input**:
```typescript
{
  query: string // Search query
  options?: {
    limit?: number // Default: 20
    offset?: number // Default: 0
    filters?: {
      stage?: string // Filter by stage ID
      module?: string // Filter by module title
    }
  }
}
```

**Output**:
```typescript
{
  results: SearchResult[]
  total: number
  query: string
}

interface SearchResult {
  id: string
  type: 'stage' | 'module' | 'concept'
  title: string
  excerpt: string // Highlighted excerpt
  stage_id: string
  module_id?: string
  score: number // Relevance score
}
```

**Behavior**:
1. 使用FlexSearch索引搜索
2. 应用filters (如果提供)
3. 高亮匹配文本
4. 按相关性排序
5. 分页返回结果

**Implementation**:
```typescript
import FlexSearch from 'flexsearch'

const searchIndex = new FlexSearch.Document({
  document: {
    id: 'id',
    index: ['title', 'content', 'keywords'],
    store: ['title', 'type', 'stage_id', 'module_id']
  },
  tokenize: 'full',
  charset: 'cjk'
})

export async function searchContent(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const { limit = 20, offset = 0, filters } = options

  let results = searchIndex.search(query, {
    limit: limit + offset,
    enrich: true
  })

  // Apply filters
  if (filters) {
    results = results.filter(r => {
      if (filters.stage && r.stage_id !== filters.stage) return false
      if (filters.module && r.module_id !== filters.module) return false
      return true
    })
  }

  // Pagination
  const paginatedResults = results.slice(offset, offset + limit)

  // Generate excerpts with highlighting
  const enrichedResults = paginatedResults.map(r => ({
    ...r,
    excerpt: generateExcerpt(r.content, query)
  }))

  return {
    results: enrichedResults,
    total: results.length,
    query
  }
}

function generateExcerpt(content: string, query: string, maxLength: number = 200): string {
  const index = content.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return content.substring(0, maxLength) + '...'

  const start = Math.max(0, index - 50)
  const end = Math.min(content.length, index + query.length + 150)

  let excerpt = content.substring(start, end)
  if (start > 0) excerpt = '...' + excerpt
  if (end < content.length) excerpt = excerpt + '...'

  // Highlight query
  const regex = new RegExp(`(${query})`, 'gi')
  excerpt = excerpt.replace(regex, '<mark>$1</mark>')

  return excerpt
}
```

---

## 3. User Progress Operations

### 3.1 Add to Favorites

**Operation**: `addToFavorites(itemId: string)`

**Input**:
```typescript
{
  itemId: string // Module ID or Concept ID (e.g., "1-0", "1-0-2")
}
```

**Output**:
```typescript
{
  success: boolean
  favorites: string[] // Updated favorites list
}
```

**Behavior**:
1. 读取当前favorites数组
2. 检查itemId是否已存在
3. 如果不存在,添加到数组
4. 更新localStorage
5. 触发状态更新

**Zustand Implementation**:
```typescript
interface UserProgressStore {
  favorites: string[]
  addToFavorites: (itemId: string) => void
}

export const useUserProgressStore = create<UserProgressStore>()(
  persist(
    (set) => ({
      favorites: [],

      addToFavorites: (itemId) => set((state) => {
        if (state.favorites.includes(itemId)) {
          return state // Already favorited
        }
        return { favorites: [...state.favorites, itemId] }
      })
    }),
    {
      name: 'learning-short-drama-storage',
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
)
```

---

### 3.2 Remove from Favorites

**Operation**: `removeFromFavorites(itemId: string)`

**Input**:
```typescript
{
  itemId: string
}
```

**Output**:
```typescript
{
  success: boolean
  favorites: string[]
}
```

**Implementation**:
```typescript
removeFromFavorites: (itemId) => set((state) => ({
  favorites: state.favorites.filter(id => id !== itemId)
}))
```

---

### 3.3 Toggle Favorite

**Operation**: `toggleFavorite(itemId: string)`

**Input**:
```typescript
{
  itemId: string
}
```

**Output**:
```typescript
{
  success: boolean
  is_favorited: boolean
  favorites: string[]
}
```

**Implementation**:
```typescript
toggleFavorite: (itemId) => set((state) => {
  const isFavorited = state.favorites.includes(itemId)
  return {
    favorites: isFavorited
      ? state.favorites.filter(id => id !== itemId)
      : [...state.favorites, itemId]
  }
})
```

---

### 3.4 Mark Module as Completed

**Operation**: `markAsCompleted(moduleId: string, completed: boolean)`

**Input**:
```typescript
{
  moduleId: string // e.g., "1-0"
  completed: boolean
}
```

**Output**:
```typescript
{
  success: boolean
  completed_modules: Record<string, boolean>
  progress_percentage: number // Stage progress
}
```

**Implementation**:
```typescript
markAsCompleted: (moduleId, completed) => set((state) => ({
  completed_modules: {
    ...state.completed_modules,
    [moduleId]: completed
  }
}))
```

---

### 3.5 Get Progress Summary

**Operation**: `getProgressSummary()`

**Input**: None

**Output**:
```typescript
{
  total_modules: number
  completed_modules: number
  progress_percentage: number
  by_stage: Array<{
    stage_id: string
    total: number
    completed: number
    percentage: number
  }>
}
```

**Implementation**:
```typescript
export function getProgressSummary(
  roadmap: Roadmap,
  completedModules: Record<string, boolean>
): ProgressSummary {
  let totalModules = 0
  let totalCompleted = 0

  const byStage = roadmap.roadmap.map(stage => {
    const stageTotal = stage.modules.length
    const stageCompleted = stage.modules.filter((_, index) => {
      const moduleId = `${stage.stage}-${index}`
      return completedModules[moduleId]
    }).length

    totalModules += stageTotal
    totalCompleted += stageCompleted

    return {
      stage_id: stage.stage,
      total: stageTotal,
      completed: stageCompleted,
      percentage: Math.round((stageCompleted / stageTotal) * 100)
    }
  })

  return {
    total_modules: totalModules,
    completed_modules: totalCompleted,
    progress_percentage: Math.round((totalCompleted / totalModules) * 100),
    by_stage: byStage
  }
}
```

---

## 4. Theme Operations

### 4.1 Set Theme

**Operation**: `setTheme(theme: 'light' | 'dark')`

**Input**:
```typescript
{
  theme: 'light' | 'dark'
}
```

**Output**:
```typescript
{
  success: boolean
  theme: 'light' | 'dark'
}
```

**Behavior**:
1. 更新Zustand store
2. 更新localStorage
3. 切换document.documentElement的class
4. 触发View Transitions API动画

**Implementation**:
```typescript
setTheme: (theme) => set((state) => {
  // Update DOM
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    })
  } else {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }

  return { theme }
})
```

---

### 4.2 Toggle Theme

**Operation**: `toggleTheme()`

**Input**: None

**Output**:
```typescript
{
  success: boolean
  theme: 'light' | 'dark'
}
```

**Implementation**:
```typescript
toggleTheme: () => set((state) => {
  const newTheme = state.theme === 'light' ? 'dark' : 'light'

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    })
  } else {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }

  return { theme: newTheme }
})
```

---

## 5. Utility Operations

### 5.1 Generate Module ID

**Operation**: `generateModuleId(stageId: string, moduleIndex: number)`

**Input**:
```typescript
{
  stageId: string
  moduleIndex: number
}
```

**Output**: `string` (e.g., "1-0")

---

### 5.2 Generate Concept ID

**Operation**: `generateConceptId(stageId: string, moduleIndex: number, conceptIndex: number)`

**Input**:
```typescript
{
  stageId: string
  moduleIndex: number
  conceptIndex: number
}
```

**Output**: `string` (e.g., "1-0-2")

---

### 5.3 Estimate Reading Time

**Operation**: `estimateReadingTime(markdown: string)`

**Input**:
```typescript
{
  markdown: string
}
```

**Output**: `number` (minutes)

**Behavior**:
```typescript
export function estimateReadingTime(markdown: string): number {
  // Count Chinese characters
  const chineseChars = (markdown.match(/[\u4e00-\u9fa5]/g) || []).length

  // Count English words
  const englishWords = (markdown.match(/[a-zA-Z]+/g) || []).length

  // Average reading speed
  const chineseTime = chineseChars / 300 // 300 chars/min
  const englishTime = englishWords / 200 // 200 words/min

  return Math.ceil(chineseTime + englishTime)
}
```

---

## Error Handling

### Error Types

```typescript
enum DataOperationError {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  STORAGE_ERROR = 'STORAGE_ERROR',
  PARSE_ERROR = 'PARSE_ERROR'
}

interface OperationError {
  type: DataOperationError
  message: string
  details?: any
}
```

### Error Responses

```typescript
interface ErrorResponse {
  success: false
  error: OperationError
}
```

### Retry Strategy

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage
const roadmapData = await withRetry(() => loadRoadmapData())
```

---

## Performance Considerations

### 1. Debouncing Search

```typescript
import { debounce } from 'lodash-es'

const debouncedSearch = debounce((query: string) => {
  searchContent(query).then(results => {
    setSearchResults(results)
  })
}, 300)
```

### 2. Memoization

```typescript
import { useMemo } from 'react'

function RoadmapView({ data }: { data: Roadmap }) {
  const progressSummary = useMemo(
    () => getProgressSummary(data, completedModules),
    [data, completedModules]
  )

  return <ProgressBar summary={progressSummary} />
}
```

### 3. Virtual Scrolling

```typescript
import { FixedSizeList } from 'react-window'

function ConceptList({ concepts }: { concepts: Concept[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={concepts.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ConceptCard concept={concepts[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

---

## Summary

本合约定义了7大类数据操作:
1. **数据加载** (2个操作): loadRoadmapData, loadStageById
2. **搜索** (1个操作): searchContent
3. **收藏** (3个操作): addToFavorites, removeFromFavorites, toggleFavorite
4. **进度追踪** (2个操作): markAsCompleted, getProgressSummary
5. **主题** (2个操作): setTheme, toggleTheme
6. **工具函数** (3个操作): generateModuleId, generateConceptId, estimateReadingTime

所有操作均为客户端操作,无需后端API支持。
