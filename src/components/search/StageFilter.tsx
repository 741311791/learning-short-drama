/**
 * StageFilter Component
 *
 * 阶段选择过滤器
 */

import { cn } from '@/lib/utils'

// 阶段选项(从数据中获取)
const STAGE_OPTIONS = [
  { id: null, label: '全部阶段' },
  { id: '1', label: '阶段 1' },
  { id: '2', label: '阶段 2' },
  { id: '3', label: '阶段 3' },
  { id: '4', label: '阶段 4' }
]

export interface StageFilterProps {
  selectedStage: string | null
  onStageChange: (stageId: string | null) => void
  className?: string
}

export function StageFilter({ selectedStage, onStageChange, className }: StageFilterProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {STAGE_OPTIONS.map((option) => (
        <button
          key={option.id || 'all'}
          onClick={() => onStageChange(option.id)}
          className={cn(
            'px-4 py-2 rounded-lg',
            'text-sm font-medium',
            'transition-all duration-200',
            'border',
            selectedStage === option.id
              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
