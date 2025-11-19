/**
 * ConceptHeader Component
 *
 * 概念标题头部，显示概念标题和预估阅读时间
 */

import { Clock } from 'lucide-react'
import { estimateReadingTime } from '@/lib/utils'
import type { Concept } from '@/types/roadmap'

export interface ConceptHeaderProps {
  concept: Concept
}

export function ConceptHeader({ concept }: ConceptHeaderProps) {
  const readingTime = estimateReadingTime(concept.concept_detail)

  return (
    <div className="mb-8">
      {/* 标题 */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {concept.concept_title}
      </h1>

      {/* 元信息 */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>预计阅读时间: {readingTime} 分钟</span>
        </div>
      </div>

      {/* 分隔线 */}
      <hr className="mt-6 border-gray-200 dark:border-gray-700" />
    </div>
  )
}
