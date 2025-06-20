
import { Button } from "@/components/ui/button"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import { useMemo } from "react"

interface CountryButtonsProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

const CountryButtons = ({ selectedCountry, onCountryChange }: CountryButtonsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()
  const { theme } = useTheme()

  const countries = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    console.log('Processing Countries from CSV data...')
    const uniqueCountries = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          // Use the exact "Country" key and filter out invalid values
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

    const countryList = Array.from(uniqueCountries).sort()
    console.log('Extracted Countries:', countryList)
    return countryList
  }, [waypointData])

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <h3 className={`${theme.textSecondary} font-medium text-sm mb-2`}>Countries/Regions</h3>
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-7 w-20 ${theme.cardBackground} rounded animate-pulse`}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className={`${theme.textSecondary} font-medium text-sm mb-2`}>Countries/Regions</h3>
      <div className="flex flex-wrap gap-2 items-center flex-1 overflow-y-auto">
        {countries.map((country) => (
          <Button
            key={country}
            variant={selectedCountry === country ? "default" : "ghost"}
            size="sm"
            onClick={() => onCountryChange(country)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium transition-all h-7 ${
              selectedCountry === country 
                ? `${theme.primary} ${theme.textPrimary} ${theme.hoverEffect} ${theme.shadowColor} shadow-md` 
                : `${theme.textSecondary} ${theme.hoverEffect} ${theme.cardBorder} border`
            }`}
          >
            {country}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CountryButtons
