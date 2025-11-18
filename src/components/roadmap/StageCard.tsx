import { Link } from 'react-router-dom'
import { Stage } from '@/types/roadmap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BookMarked } from 'lucide-react'

interface StageCardProps {
  stage: Stage
}

export function StageCard({ stage }: StageCardProps) {
  return (
    <Link to={`/stage/${stage.stage}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <Badge className="h-7 w-7 rounded-full p-0 flex items-center justify-center">
              {stage.stage}
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{stage.estimated_duration}</span>
            </div>
          </div>
          <CardTitle className="text-xl">{stage.stage_title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">{stage.stage_goal}</p>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <BookMarked className="h-3 w-3" />
            <span>{stage.modules.length} 个学习模块</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
