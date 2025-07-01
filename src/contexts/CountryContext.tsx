import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWaypointData } from '@/hooks/useWaypointData'

interface CountryContextType {
  selectedCountry: string
  setSelectedCountry: (country: string) => void
  availableCountries: string[]
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export const useCountryContext = () => {
  const context = useContext(CountryContext)
  if (!context) {
    throw new Error('useCountryContext must be used within a CountryProvider')
  }
  return context
}

interface CountryProviderProps {
  children: ReactNode
}

export const CountryProvider: React.FC<CountryProviderProps> = ({ children }) => {
  const [selectedCountry, setSelectedCountryState] = useState<string>("")
  const { data: waypointData } = useWaypointData()

  // Get available countries from data
  const availableCountries = React.useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const uniqueCountries = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country && typeof row.Country === 'string' && 
              row.Country.trim() !== '' && 
              row.Country.toLowerCase() !== 'yes' && 
              row.Country.toLowerCase() !== 'no' &&
              row.Country.toLowerCase() !== 'n/a') {
            uniqueCountries.add(row.Country.trim())
          }
        })
      }
    })

    const countryList = Array.from(uniqueCountries)
    
    // Sort countries with China first, then alphabetically
    return countryList.sort((a, b) => {
      if (a === 'China') return -1
      if (b === 'China') return 1
      return a.localeCompare(b)
    })
  }, [waypointData])

  // Initialize country selection
  useEffect(() => {
    // Try to get from localStorage first
    const savedCountry = localStorage.getItem('selectedCountry')
    
    if (savedCountry && availableCountries.includes(savedCountry)) {
      setSelectedCountryState(savedCountry)
    } else if (availableCountries.length > 0 && !selectedCountry) {
      // Default to China if available, otherwise first country
      const defaultCountry = availableCountries.includes('China') ? 'China' : availableCountries[0]
      setSelectedCountryState(defaultCountry)
      localStorage.setItem('selectedCountry', defaultCountry)
    }
  }, [availableCountries, selectedCountry])

  const setSelectedCountry = (country: string) => {
    setSelectedCountryState(country)
    localStorage.setItem('selectedCountry', country)
  }

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      setSelectedCountry,
      availableCountries
    }}>
      {children}
    </CountryContext.Provider>
  )
}