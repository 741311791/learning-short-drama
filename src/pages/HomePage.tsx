import { useEffect, useState } from 'react'
import { Roadmap } from '@/types/roadmap'
import { loadRoadmapData } from '@/lib/dataLoader'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoadmapHeader } from '@/components/roadmap/RoadmapHeader'
import { UserProfileCard } from '@/components/roadmap/UserProfileCard'
import { StageList } from '@/components/roadmap/StageList'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export function HomePage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const result = await loadRoadmapData()

    if (result.success && result.data) {
      setRoadmap(result.data)
    } else {
      setError(result.error || '加载失败')
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <LoadingSkeleton />
      </AppLayout>
    )
  }

  if (error || !roadmap) {
    return (
      <AppLayout>
        <ErrorMessage message={error || '数据加载失败'} onRetry={fetchData} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <RoadmapHeader roadmap={roadmap} />
        <UserProfileCard profile={roadmap.user_profile} />
        <StageList stages={roadmap.roadmap} />
      </div>
    </AppLayout>
  )
}
