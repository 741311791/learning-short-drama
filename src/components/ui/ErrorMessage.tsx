import { AlertCircle } from 'lucide-react'
import { Button } from './button'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">加载失败</h2>
        <p className="mb-6 text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            重试
          </Button>
        )}
      </div>
    </div>
  )
}
