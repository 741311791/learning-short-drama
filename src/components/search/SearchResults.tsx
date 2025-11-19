/**
 * SearchResults Component
 *
 * 搜索结果列表容器,显示匹配结果数量
 */

import { cn } from '@/lib/utils'
import { SearchResultCard } from './SearchResultCard'
import type { SearchResult } from '@/lib/searchService'

export interface SearchResultsProps {
  results: SearchResult[]
  query: string
  total: number
  loading?: boolean
  className?: string
}

export function SearchResults({
  results,
  query,
  total,
  loading = false,
  className
}: SearchResultsProps) {
  // 空状态
  if (!loading && results.length === 0 && query) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            没有找到相关内容
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            未找到与 "{query}" 相关的结果
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>建议:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>检查搜索词拼写是否正确</li>
              <li>尝试使用更通用的关键词</li>
              <li>使用不同的关键词组合</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // 初始状态(无查询)
  if (!query && results.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            开始搜索
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            输入关键词搜索学习阶段、模块或概念
          </p>
        </div>
      </div>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'p-4 rounded-lg',
              'bg-gray-100 dark:bg-gray-800',
              'animate-pulse',
              'h-32'
            )}
          />
        ))}
      </div>
    )
  }

  // 结果列表
  return (
    <div className={cn('space-y-6', className)}>
      {/* 结果统计 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          找到 <span className="font-semibold text-gray-900 dark:text-gray-100">{total}</span> 个
          相关结果
          {query && (
            <>
              {' '}
              关于 "
              <span className="font-semibold text-gray-900 dark:text-gray-100">{query}</span>"
            </>
          )}
        </p>
      </div>

      {/* 结果列表 */}
      <div className="space-y-3">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>

      {/* 显示更多提示 */}
      {results.length < total && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            显示前 {results.length} 个结果,共 {total} 个
          </p>
        </div>
      )}
    </div>
  )
}
