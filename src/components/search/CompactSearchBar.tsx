/**
 * CompactSearchBar Component
 *
 * Header 中使用的紧凑版搜索框
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CompactSearchBarProps {
  className?: string
}

export function CompactSearchBar({ className }: CompactSearchBarProps) {
  const navigate = useNavigate()
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const query = formData.get('query') as string

      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    },
    [navigate]
  )

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center',
          'transition-all duration-200',
          isFocused && 'ring-2 ring-blue-500/20 rounded-full'
        )}
      >
        <Search
          className={cn(
            'absolute left-3 w-4 h-4 pointer-events-none transition-colors',
            isFocused ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
          )}
        />
        <input
          type="text"
          name="query"
          placeholder="搜索..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-48 h-9 pl-9 pr-3',
            'bg-gray-100 dark:bg-gray-800',
            'border border-transparent',
            'rounded-full',
            'text-sm text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:bg-white dark:focus:bg-gray-700',
            'transition-all duration-200'
          )}
        />
      </div>
    </form>
  )
}
