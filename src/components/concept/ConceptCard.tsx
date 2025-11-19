import { Link } from 'react-router-dom'
import { Concept } from '@/types/roadmap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

interface ConceptCardProps {
  concept: Concept
  conceptIndex: number
  stageId: string
  moduleIndex: number
}

export function ConceptCard({
  concept,
  conceptIndex,
  stageId,
  moduleIndex,
}: ConceptCardProps) {
  // 提取概念详情的前100个字符作为预览
  const preview = concept.concept_detail.substring(0, 100) + '...'

  // 构建概念详情页链接
  const conceptLink = `/concept/${stageId}/${moduleIndex}/${conceptIndex}`

  return (
    <Link to={conceptLink}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>{concept.concept_title}</span>
            </CardTitle>
            {concept.detail_file && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                详细文档
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2">{preview}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
