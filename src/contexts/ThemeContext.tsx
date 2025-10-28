
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
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    background: 'bg-background',
    backgroundGradient: 'bg-gradient-to-br from-background via-background to-primary/10',
    cardBackground: 'bg-card/60 backdrop-blur-sm',
    cardBorder: 'border-border',
    textPrimary: 'text-foreground',
    textSecondary: 'text-foreground/90',
    textMuted: 'text-muted-foreground',
    hoverEffect: 'hover:bg-accent/10',
    shadowColor: 'shadow-primary/20'
  },
  light: {
    name: 'Light',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    background: 'bg-background',
    backgroundGradient: 'bg-gradient-to-br from-background via-primary/5 to-background',
    cardBackground: 'bg-card/80 backdrop-blur-sm',
    cardBorder: 'border-border',
    textPrimary: 'text-foreground',
    textSecondary: 'text-foreground/80',
    textMuted: 'text-muted-foreground',
    hoverEffect: 'hover:bg-accent/10',
    shadowColor: 'shadow-primary/20'
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

  useEffect(() => {
    // Apply or remove dark class on document root
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [currentTheme])

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
