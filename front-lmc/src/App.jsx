import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { DarkModeProvider } from './context/DarkModeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import FormationSociete from './pages/FormationSociete'
import FormationIndividuelle from './pages/FormationIndividuelle'
import FormationDetail from './pages/FormationDetail'
import APropos from './pages/APropos'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={
            <>
              <Navbar />
              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/formation-societe" element={<FormationSociete />} />
                  <Route path="/formation-individuelle" element={<FormationIndividuelle />} />
                  <Route path="/formation/:slug" element={<FormationDetail />} />
                  <Route path="/a-propos" element={<APropos />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  )
}
