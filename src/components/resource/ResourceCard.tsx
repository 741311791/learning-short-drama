import { Resource } from '@/types/roadmap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Search } from 'lucide-react'

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // 判断URL是否是真实链接
  const isRealUrl = resource.url && resource.url.startsWith('http')

  const handleClick = () => {
    if (isRealUrl) {
      window.open(resource.url, '_blank', 'noopener,noreferrer')
    } else if (resource.search_keyword) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(resource.search_keyword)}`
      window.open(searchUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{resource.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>

        {resource.tips && (
          <p className="text-xs text-primary/80 bg-primary/5 rounded p-2 mb-3">
            💡 {resource.tips}
          </p>
        )}

        <div className="space-y-2">
          {isRealUrl ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={handleClick}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              访问资源
            </Button>
          ) : resource.search_keyword ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={handleClick}
            >
              <Search className="h-3 w-3 mr-1" />
              搜索查找
            </Button>
          ) : (
            <div className="text-xs text-muted-foreground text-center py-2">
              {resource.url}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
