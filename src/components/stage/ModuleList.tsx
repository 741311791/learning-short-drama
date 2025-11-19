import { useState, useRef, useEffect } from 'react'
import { Module } from '@/types/roadmap'
import { ModuleCard } from '@/components/module/ModuleCard'

interface ModuleListProps {
  modules: Module[]
  stageId: string
}

export function ModuleList({ modules, stageId }: ModuleListProps) {
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(null)
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([])

  const toggleModule = (index: number) => {
    const newIndex = expandedModuleIndex === index ? null : index
    setExpandedModuleIndex(newIndex)
  }

  // Smooth scroll to expanded module (T048)
  useEffect(() => {
    if (expandedModuleIndex !== null && moduleRefs.current[expandedModuleIndex]) {
      setTimeout(() => {
        moduleRefs.current[expandedModuleIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 100) // 等待展开动画开始后再滚动
    }
  }, [expandedModuleIndex])

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <div key={index} ref={(el) => (moduleRefs.current[index] = el)}>
          <ModuleCard
            module={module}
            moduleIndex={index}
            stageId={stageId}
            isExpanded={expandedModuleIndex === index}
            onToggle={() => toggleModule(index)}
          />
        </div>
      ))}
    </div>
  )
}
