/**
 * ConceptDetailPage Component
 *
 * 概念详情页，显示完整的概念说明
 */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadRoadmapData } from '@/lib/dataLoader'
import { ConceptHeader } from '@/components/concept/ConceptHeader'
import { ConceptContent } from '@/components/concept/ConceptContent'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Concept, Module, Stage } from '@/types/roadmap'

export function ConceptDetailPage() {
  const { stageId, moduleIndex, conceptIndex } = useParams<{
    stageId: string
    moduleIndex: string
    conceptIndex: string
  }>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [concept, setConcept] = useState<Concept | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const result = await loadRoadmapData()
        if (!result.success || !result.data) {
          throw new Error(result.error || '加载数据失败')
        }

        const foundStage = result.data.roadmap.find((s) => s.stage === stageId)
        if (!foundStage) {
          throw new Error(`未找到阶段 ${stageId}`)
        }

        const modIndex = parseInt(moduleIndex || '0', 10)
        const foundModule = foundStage.modules[modIndex]
        if (!foundModule) {
          throw new Error(`未找到模块 ${modIndex}`)
        }

        const conIndex = parseInt(conceptIndex || '0', 10)
        const foundConcept = foundModule.core_concepts[conIndex]
        if (!foundConcept) {
          throw new Error(`未找到概念 ${conIndex}`)
        }

        setStage(foundStage)
        setModule(foundModule)
        setConcept(foundConcept)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [stageId, moduleIndex, conceptIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error || !stage || !module || !concept) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error || '未找到概念'} onRetry={() => window.location.reload()} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑导航 */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: '首页', path: '/' },
              { label: stage.stage_title, path: `/stage/${stageId}` },
              { label: module.module_title, path: `/stage/${stageId}#module-${stageId}-${moduleIndex}` },
              { label: concept.concept_title }
            ]}
          />
        </div>

        {/* 概念标题 */}
        <ConceptHeader concept={concept} />

        {/* 概念内容 */}
        <ConceptContent concept={concept} />
      </div>
    </div>
  )
}