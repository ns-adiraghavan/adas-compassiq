
import { Button } from "@/components/ui/button"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

interface CountryButtonsProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

const CountryButtons = ({ selectedCountry, onCountryChange }: CountryButtonsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

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
      <div className="space-y-2">
        <h3 className="text-gray-400 font-medium mb-4">Countries/Regions</h3>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-full bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 font-medium mb-4">Countries/Regions</h3>
      {countries.map((country) => (
        <Button
          key={country}
          variant={selectedCountry === country ? "default" : "ghost"}
          size="sm"
          onClick={() => onCountryChange(country)}
          className={`w-full justify-start ${
            selectedCountry === country 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          {country}
        </Button>
      ))}
    </div>
  )
}

export default CountryButtons
