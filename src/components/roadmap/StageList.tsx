import { Stage } from '@/types/roadmap'
import { StageCard } from './StageCard'

interface StageListProps {
  stages: Stage[]
}

export function StageList({ stages }: StageListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stages.map((stage) => (
        <StageCard key={stage.stage} stage={stage} />
      ))}
    </div>
  )
}
