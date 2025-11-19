import { Module } from '@/types/roadmap'
import { ConceptList } from '@/components/module/ConceptList'
import { ResourceList } from '@/components/module/ResourceList'
import { Lightbulb } from 'lucide-react'

interface ModuleDetailProps {
  module: Module
  stageId: string
  moduleIndex: number
}

export function ModuleDetail({ module, stageId, moduleIndex }: ModuleDetailProps) {
  return (
    <div className="space-y-6 pt-4">
      {/* Core Concepts Section */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">核心概念</h3>
        <ConceptList
          concepts={module.core_concepts}
          stageId={stageId}
          moduleIndex={moduleIndex}
        />
      </div>

      {/* Demystification Analogy */}
      {module.demystification_analogy && (
        <div className="rounded-lg bg-primary/5 p-4 border-l-4 border-primary">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-primary">通俗比喻</h3>
          </div>
          <p className="text-sm text-foreground">{module.demystification_analogy}</p>
        </div>
      )}

      {/* Recommended Resources */}
      {module.recommended_resources && module.recommended_resources.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">推荐资源</h3>
          <ResourceList resources={module.recommended_resources} />
        </div>
      )}
    </div>
  )
}
