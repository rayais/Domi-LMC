import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { getTheme } from './services/api'

function App() {
  useEffect(() => {
    getTheme()
      .then(colors => {
        if (colors && typeof colors === 'object') {
          const root = document.documentElement
          Object.entries(colors).forEach(([key, val]) => {
            root.style.setProperty(key, val)
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
