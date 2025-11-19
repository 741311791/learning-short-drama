import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CompactSearchBar } from '@/components/search/CompactSearchBar'
import { Home, Heart, Search } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <span className="text-xl font-bold">短剧学习路线图</span>
        </Link>

        {/* Center: Compact Search Bar (desktop only) */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <CompactSearchBar />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>首页</span>
          </Link>
          <Link
            to="/favorites"
            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Heart className="h-4 w-4" />
            <span>我的收藏</span>
          </Link>
          <Link
            to="/search"
            className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <Search className="h-4 w-4" />
            <span>搜索</span>
          </Link>
        </nav>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
