
import React, { createContext, useContext, useState, useEffect } from 'react'

export type ThemeType = 'dark' | 'light'

interface Theme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundGradient: string
  cardBackground: string
  cardBorder: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  hoverEffect: string
  shadowColor: string
}

const themes: Record<ThemeType, Theme> = {
  dark: {
    name: 'Dark',
    primary: 'bg-blue-600',
    secondary: 'bg-cyan-500',
    accent: 'bg-blue-400',
    background: 'bg-slate-900',
    backgroundGradient: 'bg-gradient-to-br from-slate-900 via-blue-900/20 to-cyan-900/10',
    cardBackground: 'bg-slate-800/60 backdrop-blur-sm',
    cardBorder: 'border-slate-700/50',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-200',
    textMuted: 'text-slate-400',
    hoverEffect: 'hover:bg-slate-700/50',
    shadowColor: 'shadow-blue-500/20'
  },
  light: {
    name: 'Light',
    primary: 'bg-slate-700',
    secondary: 'bg-blue-600',
    accent: 'bg-slate-500',
    background: 'bg-slate-50',
    backgroundGradient: 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100/50',
    cardBackground: 'bg-white/80 backdrop-blur-sm',
    cardBorder: 'border-slate-200/60',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    hoverEffect: 'hover:bg-slate-100/50',
    shadowColor: 'shadow-slate-500/20'
  }
}

interface ThemeContextType {
  currentTheme: ThemeType
  theme: Theme
  setTheme: (theme: ThemeType) => void
  themes: Record<ThemeType, Theme>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('section-theme') as ThemeType
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme)
    localStorage.setItem('section-theme', theme)
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme: themes[currentTheme],
      setTheme,
      themes
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
