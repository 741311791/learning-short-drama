import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { StageDetailPage } from './pages/StageDetailPage'
import { SearchPage } from './pages/SearchPage'
import { ConceptDetailPage } from './pages/ConceptDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stage/:stageId" element={<StageDetailPage />} />
        <Route path="/concept/:stageId/:moduleIndex/:conceptIndex" element={<ConceptDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<div>Favorites - Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
