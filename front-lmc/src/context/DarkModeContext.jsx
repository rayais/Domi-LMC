import { createContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('lmc-dark-mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('lmc-dark-mode', dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggle = () => setDark(prev => !prev)

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}
