import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page - Coming Soon</div>} />
        <Route path="/stage/:stageId" element={<div>Stage Detail - Coming Soon</div>} />
        <Route path="/search" element={<div>Search - Coming Soon</div>} />
        <Route path="/favorites" element={<div>Favorites - Coming Soon</div>} />
      </Routes>
    </Router>
  )
}

export default App
