/**
 * Markdown Components
 *
 * 自定义 Markdown 元素渲染
 */

import { cn } from '@/lib/utils'
import type { Components } from 'react-markdown'

export const MarkdownComponents: Components = {
  // 标题
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2
      className="text-2xl font-bold mt-8 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </h3>
  ),

  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </h4>
  ),

  h5: ({ children, ...props }) => (
    <h5 className="text-base font-semibold mt-3 mb-1 text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </h5>
  ),

  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-semibold mt-2 mb-1 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </h6>
  ),

  // 段落
  p: ({ children, ...props }) => (
    <p className="text-base leading-relaxed my-4 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </p>
  ),

  // 链接
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 列表
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside my-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside my-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),

  // 引用
  blockquote: ({ children, ...props }) => (
    <blockquote
      className={cn(
        'border-l-4 border-blue-500 pl-4 my-4 italic',
        'bg-blue-50 dark:bg-blue-900/20 py-2 pr-4 rounded-r',
        'text-gray-700 dark:text-gray-300'
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),

  // 水平线
  hr: (props) => <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />,

  // 强调
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props}>
      {children}
    </em>
  ),

  // 删除线
  del: ({ children, ...props }) => (
    <del className="line-through text-gray-500 dark:text-gray-400" {...props}>
      {children}
    </del>
  ),

  // 表格
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }) => (
    <thead className="bg-gray-100 dark:bg-gray-800" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900" {...props}>
      {children}
    </tbody>
  ),

  tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,

  th: ({ children, ...props }) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </td>
  ),

  // 任务列表
  input: ({ checked, ...props }) => (
    <input
      type="checkbox"
      checked={checked}
      disabled
      className="mr-2 accent-blue-500"
      {...props}
    />
  )
}
