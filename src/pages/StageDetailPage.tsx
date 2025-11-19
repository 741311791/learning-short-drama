import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Stage } from '@/types/roadmap'
import { loadStageById } from '@/lib/dataLoader'
import { AppLayout } from '@/components/layout/AppLayout'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { StageHeader } from '@/components/stage/StageHeader'
import { ModuleList } from '@/components/stage/ModuleList'

export function StageDetailPage() {
  const { stageId } = useParams<{ stageId: string }>()
  const [stage, setStage] = useState<Stage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStage = async () => {
    if (!stageId) {
      setError('阶段ID缺失')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const result = await loadStageById(stageId)

    if (result.success && result.data) {
      setStage(result.data)
    } else {
      setError(result.error || '加载阶段数据失败')
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchStage()
  }, [stageId])

  if (loading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    )
  }

  if (error || !stage) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <ErrorMessage message={error || '未找到阶段数据'} onRetry={fetchStage} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: `阶段 ${stage.stage}: ${stage.stage_title}` }]}
        />

        <StageHeader stage={stage} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">学习模块</h2>
          <ModuleList modules={stage.modules} stageId={stage.stage} />
        </div>
      </div>
    </AppLayout>
  )
}
