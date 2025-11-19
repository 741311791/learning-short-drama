/**
 * SearchBar Component
 *
 * 搜索输入框组件,支持防抖输入和清除功能
 */

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  value?: string
  placeholder?: string
  className?: string
  debounceMs?: number
  onSearch: (query: string) => void
  onClear?: () => void
}

export function SearchBar({
  value = '',
  placeholder = '搜索学习内容...',
  className,
  debounceMs = 300,
  onSearch,
  onClear
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() !== value) {
        onSearch(inputValue.trim())
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs, onSearch, value])

  // 清除输入
  const handleClear = useCallback(() => {
    setInputValue('')
    onSearch('')
    onClear?.()
  }, [onSearch, onClear])

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        handleClear()
      } else if (e.key === 'Enter') {
        onSearch(inputValue.trim())
      }
    },
    [inputValue, onSearch, handleClear]
  )

  return (
    <div
      className={cn(
        'relative w-full max-w-2xl transition-all duration-200',
        isFocused && 'ring-2 ring-blue-500/20 rounded-full',
        className
      )}
    >
      {/* 搜索图标 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search
          className={cn(
            'w-5 h-5 transition-colors duration-200',
            isFocused ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
          )}
        />
      </div>

      {/* 输入框 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full h-12 pl-12 pr-12',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'rounded-full',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:outline-none',
          'transition-all duration-200',
          'text-base'
        )}
        aria-label="搜索"
      />

      {/* 清除按钮 */}
      {inputValue && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2',
            'w-6 h-6',
            'flex items-center justify-center',
            'text-gray-400 hover:text-gray-600',
            'dark:text-gray-500 dark:hover:text-gray-300',
            'transition-colors duration-200',
            'rounded-full',
            'hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
          aria-label="清除搜索"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
