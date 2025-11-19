import { Resource } from '@/types/roadmap'
import { ResourceCard } from '@/components/resource/ResourceCard'

interface ResourceListProps {
  resources: Resource[]
}

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} />
      ))}
    </div>
  )
}
