/**
 * ConceptContent Component
 *
 * 概念内容显示，使用 MarkdownRenderer 渲染
 */

import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import type { Concept } from '@/types/roadmap'

export interface ConceptContentProps {
  concept: Concept
}

export function ConceptContent({ concept }: ConceptContentProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
      <MarkdownRenderer content={concept.concept_detail} />
    </div>
  )
}
