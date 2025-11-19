import { Stage } from '@/types/roadmap'
import { Clock, Target } from 'lucide-react'

interface StageHeaderProps {
  stage: Stage
}

export function StageHeader({ stage }: StageHeaderProps) {
  return (
    <div className="mb-8 rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              {stage.stage}
            </div>
            <h1 className="text-3xl font-bold">{stage.stage_title}</h1>
          </div>

          <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{stage.estimated_duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>{stage.modules.length} 个学习模块</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-muted/50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">阶段目标</h2>
        <p className="text-foreground">{stage.stage_goal}</p>
      </div>
    </div>
  )
}
