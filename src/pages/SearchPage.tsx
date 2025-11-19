/**
 * SearchPage Component
 *
 * 搜索页面,整合搜索栏、过滤器和结果显示
 */

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchContent, type SearchResult } from '@/lib/searchService'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterBar } from '@/components/search/FilterBar'
import { SearchResults } from '@/components/search/SearchResults'
import { cn } from '@/lib/utils'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedStage, setSelectedStage] = useState<string | null>(
    searchParams.get('stage') || null
  )
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTime, setSearchTime] = useState(0)

  // 执行搜索
  const performSearch = useCallback(
    async (searchQuery: string, stageFilter: string | null) => {
      if (!searchQuery.trim()) {
        setResults([])
        setTotal(0)
        setSearchTime(0)
        return
      }

      setLoading(true)

      try {
        const response = await searchContent(searchQuery, {
          limit: 20,
          filters: stageFilter ? { stage: stageFilter } : undefined
        })

        setResults(response.results)
        setTotal(response.total)
        setSearchTime(response.time)
      } catch (error) {
        console.error('搜索失败:', error)
        setResults([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // 处理搜索
  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)

      // 更新 URL 参数
      const params = new URLSearchParams()
      if (newQuery) params.set('q', newQuery)
      if (selectedStage) params.set('stage', selectedStage)
      setSearchParams(params)

      performSearch(newQuery, selectedStage)
    },
    [selectedStage, setSearchParams, performSearch]
  )

  // 处理阶段过滤
  const handleStageChange = useCallback(
    (stageId: string | null) => {
      setSelectedStage(stageId)

      // 更新 URL 参数
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (stageId) params.set('stage', stageId)
      setSearchParams(params)

      // 如果有查询,重新搜索
      if (query) {
        performSearch(query, stageId)
      }
    },
    [query, setSearchParams, performSearch]
  )

  // 初始搜索(基于 URL 参数)
  useEffect(() => {
    const initialQuery = searchParams.get('q') || ''
    const initialStage = searchParams.get('stage') || null

    if (initialQuery) {
      performSearch(initialQuery, initialStage)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">搜索</h1>
          <p className="text-gray-600 dark:text-gray-400">
            在学习路线图中搜索阶段、模块或概念
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-6">
          <SearchBar value={query} onSearch={handleSearch} />
        </div>

        {/* 过滤器 */}
        {query && (
          <div className="mb-6">
            <FilterBar selectedStage={selectedStage} onStageChange={handleStageChange} />
          </div>
        )}

        {/* 搜索性能指标 */}
        {query && results.length > 0 && !loading && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              搜索耗时: {searchTime}ms
              {searchTime < 200 && ' ⚡'}
            </p>
          </div>
        )}

        {/* 搜索结果 */}
        <SearchResults results={results} query={query} total={total} loading={loading} />
      </div>
    </div>
  )
}
