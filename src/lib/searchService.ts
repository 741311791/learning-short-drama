/**
 * Search Service
 *
 * 基于 FlexSearch 的高性能搜索服务
 * 支持中文分词、模糊搜索、结果高亮
 */

import FlexSearch from 'flexsearch'
import searchIndexData from '@/data/searchIndex.json'

// 搜索文档接口
export interface SearchDocument {
  id: string
  type: 'stage' | 'module' | 'concept'
  title: string
  content: string
  keywords: string
  stage_id: string
  module_id?: string
  concept_id?: string
  [key: string]: string | undefined
}

// 搜索结果接口
export interface SearchResult {
  id: string
  type: 'stage' | 'module' | 'concept'
  title: string
  excerpt: string // 高亮后的摘要
  stage_id: string
  module_id?: string
  concept_id?: string
  score: number
}

// 搜索选项接口
export interface SearchOptions {
  limit?: number
  offset?: number
  filters?: {
    stage?: string
    type?: 'stage' | 'module' | 'concept'
  }
}

// 搜索响应接口
export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  time: number // 搜索耗时(ms)
}

// 创建搜索索引实例
let searchIndex: any = null

/**
 * 初始化搜索索引
 */
function initializeSearchIndex(): any {
  if (searchIndex) {
    return searchIndex
  }

  const index = new (FlexSearch as any).Document({
    document: {
      id: 'id',
      index: ['title', 'content', 'keywords'],
      store: ['type', 'title', 'stage_id', 'module_id', 'concept_id', 'content']
    },
    tokenize: 'full',
    charset: 'cjk',
    encode: false,
    stemmer: false,
    context: {
      resolution: 9,
      depth: 3,
      bidirectional: true
    }
  })

  // 加载预构建的搜索文档
  const documents = (searchIndexData as any).documents as SearchDocument[]
  documents.forEach((doc) => {
    index.add(doc)
  })

  searchIndex = index
  return index
}

/**
 * 生成高亮摘要
 *
 * @param content - 原始内容
 * @param query - 搜索查询
 * @param maxLength - 最大长度
 * @returns 高亮后的摘要
 */
function generateExcerpt(content: string, query: string, maxLength = 200): string {
  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // 查找匹配位置
  const index = lowerContent.indexOf(lowerQuery)

  let excerpt: string
  if (index === -1) {
    // 未找到精确匹配,返回开头部分
    excerpt = content.substring(0, maxLength)
  } else {
    // 找到匹配,提取上下文
    const start = Math.max(0, index - 50)
    const end = Math.min(content.length, index + query.length + 150)
    excerpt = content.substring(start, end)

    if (start > 0) excerpt = '...' + excerpt
    if (end < content.length) excerpt = excerpt + '...'
  }

  // 高亮匹配的查询词
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi')
  excerpt = excerpt.replace(regex, '<mark>$1</mark>')

  return excerpt
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 搜索内容
 *
 * @param query - 搜索查询
 * @param options - 搜索选项
 * @returns 搜索结果
 */
export async function searchContent(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const startTime = performance.now()

  // 参数验证
  if (!query || query.trim().length === 0) {
    return {
      results: [],
      total: 0,
      query: '',
      time: 0
    }
  }

  const { limit = 20, offset = 0, filters } = options

  // 初始化索引
  const index = initializeSearchIndex()

  try {
    // 执行搜索
    const searchResults = index.search(query.trim(), {
      limit: 100, // 先获取更多结果用于过滤
      enrich: true
    })

    // 提取结果并展平
    let allResults: any[] = []
    if (Array.isArray(searchResults)) {
      searchResults.forEach((fieldResults: any) => {
        if (fieldResults.result) {
          allResults = allResults.concat(fieldResults.result)
        }
      })
    }

    // 去重(基于 ID)
    const uniqueResults = Array.from(
      new Map(allResults.map((item: any) => [item.id, item])).values()
    )

    // 应用过滤器
    let filteredResults = uniqueResults
    if (filters) {
      filteredResults = filteredResults.filter((item: any) => {
        const doc = item.doc as SearchDocument

        if (filters.stage && doc.stage_id !== filters.stage) {
          return false
        }

        if (filters.type && doc.type !== filters.type) {
          return false
        }

        return true
      })
    }

    // 分页
    const paginatedResults = filteredResults.slice(offset, offset + limit)

    // 构建搜索结果
    const results: SearchResult[] = paginatedResults.map((item: any, index: number) => {
      const doc = item.doc as SearchDocument

      return {
        id: doc.id,
        type: doc.type,
        title: doc.title,
        excerpt: generateExcerpt(doc.content, query),
        stage_id: doc.stage_id,
        module_id: doc.module_id,
        concept_id: doc.concept_id,
        score: 100 - index // 简单评分:基于排序位置
      }
    })

    const endTime = performance.now()

    return {
      results,
      total: filteredResults.length,
      query: query.trim(),
      time: Math.round(endTime - startTime)
    }
  } catch (error) {
    console.error('搜索失败:', error)
    return {
      results: [],
      total: 0,
      query: query.trim(),
      time: Math.round(performance.now() - startTime)
    }
  }
}

/**
 * 获取搜索建议
 *
 * @param query - 查询字符串
 * @param limit - 返回数量
 * @returns 建议列表
 */
export async function getSearchSuggestions(query: string, limit = 5): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const response = await searchContent(query, { limit })
  return response.results.map((result) => result.title).slice(0, limit)
}

/**
 * 获取搜索统计信息
 */
export function getSearchStats() {
  const data = searchIndexData as any
  return {
    totalDocuments: data.indexMeta?.totalDocuments || 0,
    types: data.indexMeta?.types || {},
    buildDate: data.indexMeta?.buildDate || null
  }
}