import { Module } from '@/types/roadmap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { ModuleDetail } from './ModuleDetail'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
  module: Module
  moduleIndex: number
  stageId: string
  isExpanded: boolean
  onToggle: () => void
}

export function ModuleCard({
  module,
  moduleIndex,
  stageId,
  isExpanded,
  onToggle,
}: ModuleCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-out-expo',
        isExpanded && 'ring-2 ring-primary/20'
      )}
    >
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {moduleIndex + 1}
            </div>
            <CardTitle className="text-lg">{module.module_title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">{module.core_concepts.length} 个核心概念</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 transition-transform" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform" />
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{module.module_purpose}</p>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <ModuleDetail module={module} stageId={stageId} moduleIndex={moduleIndex} />
        </CardContent>
      )}
    </Card>
  )
}
