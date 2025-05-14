import { Routes, Route } from 'react-router-dom'
import Messages from './components/Messages'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Messages />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App