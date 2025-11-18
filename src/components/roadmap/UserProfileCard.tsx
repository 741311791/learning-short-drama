import { UserProfile } from '@/types/roadmap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, BookOpen, Lightbulb } from 'lucide-react'

interface UserProfileCardProps {
  profile: UserProfile
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <Card className="mb-12 border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>目标用户画像</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 flex items-center space-x-2 font-semibold">
            <BookOpen className="h-4 w-4" />
            <span>背景</span>
          </h4>
          <p className="text-muted-foreground">{profile.background}</p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">技能水平</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {profile.skill_level.programming_foundation && (
              <li>• {profile.skill_level.programming_foundation}</li>
            )}
            <li>• {profile.skill_level.related_experience}</li>
            <li>• {profile.skill_level.prerequisite_knowledge}</li>
          </ul>
        </div>

        <div className="rounded-lg bg-primary/10 p-4">
          <h4 className="mb-2 flex items-center space-x-2 font-semibold text-primary">
            <Lightbulb className="h-4 w-4" />
            <span>学习目标</span>
          </h4>
          <p className="text-sm">{profile.learning_goal}</p>
        </div>
      </CardContent>
    </Card>
  )
}
