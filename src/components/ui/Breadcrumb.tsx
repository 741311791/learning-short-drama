import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  path?: string // 支持 path 作为 href 的别名
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        to="/"
        className="flex items-center space-x-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>首页</span>
      </Link>

      {items.map((item, index) => {
        const link = item.href || item.path
        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {link ? (
              <Link to={link} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
