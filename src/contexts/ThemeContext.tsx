
import React, { createContext, useContext, useState, useEffect } from 'react'

export type ThemeType = 'midnight' | 'emerald' | 'sunset' | 'royal' | 'arctic'

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
  midnight: {
    name: 'Midnight Blue',
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
  emerald: {
    name: 'Emerald Green',
    primary: 'bg-emerald-600',
    secondary: 'bg-amber-500',
    accent: 'bg-emerald-400',
    background: 'bg-gray-900',
    backgroundGradient: 'bg-gradient-to-br from-gray-900 via-emerald-900/20 to-amber-900/10',
    cardBackground: 'bg-gray-800/60 backdrop-blur-sm',
    cardBorder: 'border-emerald-700/50',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-400',
    hoverEffect: 'hover:bg-gray-700/50',
    shadowColor: 'shadow-emerald-500/20'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'bg-orange-600',
    secondary: 'bg-pink-500',
    accent: 'bg-orange-400',
    background: 'bg-stone-900',
    backgroundGradient: 'bg-gradient-to-br from-stone-900 via-orange-900/20 to-pink-900/10',
    cardBackground: 'bg-stone-800/60 backdrop-blur-sm',
    cardBorder: 'border-orange-700/50',
    textPrimary: 'text-white',
    textSecondary: 'text-stone-200',
    textMuted: 'text-stone-400',
    hoverEffect: 'hover:bg-stone-700/50',
    shadowColor: 'shadow-orange-500/20'
  },
  royal: {
    name: 'Royal Purple',
    primary: 'bg-purple-600',
    secondary: 'bg-pink-500',
    accent: 'bg-purple-400',
    background: 'bg-gray-900',
    backgroundGradient: 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/10',
    cardBackground: 'bg-gray-800/60 backdrop-blur-sm',
    cardBorder: 'border-purple-700/50',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-400',
    hoverEffect: 'hover:bg-gray-700/50',
    shadowColor: 'shadow-purple-500/20'
  },
  arctic: {
    name: 'Arctic White',
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
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('midnight')

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
