/**
 * SearchResultCard Component
 *
 * 搜索结果卡片,显示结果类型、标题和高亮摘要
 */

import { Link } from 'react-router-dom'
import { FileText, FolderOpen, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchResult } from '@/lib/searchService'

export interface SearchResultCardProps {
  result: SearchResult
  className?: string
}

export function SearchResultCard({ result, className }: SearchResultCardProps) {
  // 根据类型确定链接路径
  const getResultLink = (): string => {
    switch (result.type) {
      case 'stage':
        return `/stage/${result.stage_id}`
      case 'module':
        return `/stage/${result.stage_id}#module-${result.module_id}`
      case 'concept':
        return `/stage/${result.stage_id}#concept-${result.concept_id}`
      default:
        return '/'
    }
  }

  // 获取类型标签
  const getTypeLabel = (): string => {
    switch (result.type) {
      case 'stage':
        return '阶段'
      case 'module':
        return '模块'
      case 'concept':
        return '概念'
      default:
        return ''
    }
  }

  // 获取类型图标
  const TypeIcon = () => {
    switch (result.type) {
      case 'stage':
        return <FolderOpen className="w-4 h-4" />
      case 'module':
        return <FileText className="w-4 h-4" />
      case 'concept':
        return <Lightbulb className="w-4 h-4" />
      default:
        return null
    }
  }

  // 获取类型颜色
  const getTypeColor = (): string => {
    switch (result.type) {
      case 'stage':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'module':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'concept':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <Link
      to={getResultLink()}
      className={cn(
        'block group',
        'p-4 rounded-lg',
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'hover:border-blue-300 dark:hover:border-blue-600',
        'hover:shadow-md dark:hover:shadow-blue-900/20',
        'transition-all duration-200',
        className
      )}
    >
      {/* 类型标签 */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5',
            'px-2 py-1',
            'rounded-md',
            'text-xs font-medium',
            getTypeColor()
          )}
        >
          <TypeIcon />
          {getTypeLabel()}
        </span>

        {/* 评分(可选显示) */}
        {result.score && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            相关度: {Math.round(result.score)}%
          </span>
        )}
      </div>

      {/* 标题 */}
      <h3
        className={cn(
          'text-lg font-semibold mb-2',
          'text-gray-900 dark:text-gray-100',
          'group-hover:text-blue-600 dark:group-hover:text-blue-400',
          'transition-colors duration-200'
        )}
      >
        {result.title}
      </h3>

      {/* 摘要(带高亮) */}
      <div
        className={cn(
          'text-sm text-gray-600 dark:text-gray-400',
          'line-clamp-2',
          'leading-relaxed',
          '[&_mark]:bg-yellow-200 [&_mark]:text-yellow-900',
          'dark:[&_mark]:bg-yellow-900/40 dark:[&_mark]:text-yellow-300',
          '[&_mark]:px-1 [&_mark]:rounded'
        )}
        dangerouslySetInnerHTML={{ __html: result.excerpt }}
      />
    </Link>
  )
}
