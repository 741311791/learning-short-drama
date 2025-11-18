import { Roadmap } from '@/types/roadmap'

interface RoadmapHeaderProps {
  roadmap: Roadmap
}

export function RoadmapHeader({ roadmap }: RoadmapHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{roadmap.title}</h1>
      <p className="text-lg text-muted-foreground">
        专为{roadmap.user_profile.background}设计的学习路线
      </p>
    </div>
  )
}
