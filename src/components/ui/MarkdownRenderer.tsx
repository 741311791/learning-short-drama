/**
 * MarkdownRenderer Component
 *
 * Markdown 渲染组件，支持 GFM 和语法高亮
 */

import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useThemeStore } from '@/store/useThemeStore'
import { cn } from '@/lib/utils'
import { MarkdownComponents } from './MarkdownComponents'

export interface MarkdownRendererProps {
  content: string
  className?: string
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className
}: MarkdownRendererProps) {
  const theme = useThemeStore((state) => state.theme)

  // 选择语法高亮主题
  const syntaxTheme = useMemo(() => {
    return theme === 'dark' ? oneDark : oneLight
  }, [theme])

  // 自定义组件
  const components = useMemo(
    () => ({
      ...MarkdownComponents,
      // 代码块高亮
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[1] : ''

        if (!inline && language) {
          return (
            <SyntaxHighlighter
              style={syntaxTheme}
              language={language}
              PreTag="div"
              className="rounded-lg my-4 text-sm"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          )
        }

        // 内联代码
        return (
          <code
            className={cn(
              'px-1.5 py-0.5 rounded',
              'bg-gray-100 dark:bg-gray-800',
              'text-sm font-mono',
              'text-pink-600 dark:text-pink-400',
              className
            )}
            {...props}
          >
            {children}
          </code>
        )
      }
    }),
    [syntaxTheme]
  )

  return (
    <div
      className={cn(
        'prose prose-gray dark:prose-invert max-w-none',
        'prose-headings:font-bold',
        'prose-h1:text-3xl prose-h1:mb-4',
        'prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3',
        'prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2',
        'prose-p:text-base prose-p:leading-relaxed prose-p:my-4',
        'prose-ul:my-4 prose-ol:my-4',
        'prose-li:my-1',
        'prose-blockquote:border-l-4 prose-blockquote:border-blue-500',
        'prose-blockquote:pl-4 prose-blockquote:italic',
        'prose-code:text-pink-600 dark:prose-code:text-pink-400',
        'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950',
        'prose-a:text-blue-600 dark:prose-a:text-blue-400',
        'prose-a:no-underline hover:prose-a:underline',
        'prose-strong:font-semibold',
        'prose-table:my-6',
        'prose-th:bg-gray-100 dark:prose-th:bg-gray-800',
        'prose-td:border prose-th:border',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
})
