import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import AnimatedRoutes from './components/AnimatedRoutes'
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white cursor-none">
        <CustomCursor />
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App
