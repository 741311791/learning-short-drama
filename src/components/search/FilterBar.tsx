/**
 * FilterBar Component
 *
 * 搜索过滤器栏,包含阶段选择器
 */

import { cn } from '@/lib/utils'
import { StageFilter } from './StageFilter'

export interface FilterBarProps {
  selectedStage: string | null
  onStageChange: (stageId: string | null) => void
  className?: string
}

export function FilterBar({ selectedStage, onStageChange, className }: FilterBarProps) {
  return (
    <div className={cn('flex items-center gap-4 flex-wrap', className)}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">筛选:</span>

      <StageFilter selectedStage={selectedStage} onStageChange={onStageChange} />
    </div>
  )
}
