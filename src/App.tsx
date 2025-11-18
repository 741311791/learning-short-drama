import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stage/:stageId" element={<div>Stage Detail - Coming Soon</div>} />
        <Route path="/search" element={<div>Search - Coming Soon</div>} />
        <Route path="/favorites" element={<div>Favorites - Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
