import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'

// 路由级代码分割
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const StageDetailPage = lazy(() => import('./pages/StageDetailPage').then(m => ({ default: m.StageDetailPage })))
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })))
const ConceptDetailPage = lazy(() => import('./pages/ConceptDetailPage').then(m => ({ default: m.ConceptDetailPage })))

// 加载状态组件
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stage/:stageId" element={<StageDetailPage />} />
            <Route path="/concept/:stageId/:moduleIndex/:conceptIndex" element={<ConceptDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><p className="text-gray-600 dark:text-gray-400">收藏功能开发中...</p></div>} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App
