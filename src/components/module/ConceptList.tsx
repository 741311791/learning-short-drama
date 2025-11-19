import { Concept } from '@/types/roadmap'
import { ConceptCard } from '@/components/concept/ConceptCard'

interface ConceptListProps {
  concepts: Concept[]
  stageId: string
  moduleIndex: number
}

export function ConceptList({ concepts, stageId, moduleIndex }: ConceptListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {concepts.map((concept, index) => (
        <ConceptCard
          key={index}
          concept={concept}
          conceptIndex={index}
          stageId={stageId}
          moduleIndex={moduleIndex}
        />
      ))}
    </div>
  )
}
