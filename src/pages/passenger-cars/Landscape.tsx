
import { useState, useEffect } from "react"
import { useFirstAvailableOEM, useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMBarChart from "@/components/passenger-cars/charts/OEMBarChart"
import LandscapeDetails from "@/components/passenger-cars/details/LandscapeDetails"
import AISnippetsSidebar from "@/components/passenger-cars/AISnippetsSidebar"
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import { useTheme } from "@/contexts/ThemeContext"

const LandscapeContent = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEM, setSelectedOEM] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [oemClickedFromChart, setOemClickedFromChart] = useState(false) // Track if OEM was clicked from chart
  const { data: firstOEM } = useFirstAvailableOEM()
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  // useEffect hooks for setting default country and OEM
  useEffect(() => {
    if (waypointData?.csvData?.length && !selectedCountry) {
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

      const sortedCountries = Array.from(uniqueCountries).sort()
      if (sortedCountries.length > 0) {
        setSelectedCountry(sortedCountries[0])
      }
    }
  }, [waypointData, selectedCountry])

  useEffect(() => {
    if (firstOEM && !selectedOEM) {
      setSelectedOEM(firstOEM)
      // Don't set oemClickedFromChart to true here since this is automatic selection
    }
  }, [firstOEM, selectedOEM])

  const handleOEMClick = (oem: string) => {
    setSelectedOEM(oem)
    setShowDetails(true)
    setOemClickedFromChart(true) // Mark that OEM was clicked from chart
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setShowDetails(false)
    setSelectedOEM("")
    setOemClickedFromChart(false) // Reset chart click state when country changes
  }

  return (
    <div className="w-full flex">
      {/* Main Content Area - 60% */}
      <div className="w-3/5 px-6 py-4 space-y-6">
        {/* Countries Section */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-[120px]`}>
          <CountryButtons
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        </div>

        {/* OEM Bar Chart */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-[400px]`}>
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>OEM Feature Distribution</h3>
            <p className={`${theme.textMuted} text-sm`}>
              {selectedCountry ? `Showing feature counts for ${selectedCountry}. ` : ''}
              Click on any OEM bar to view detailed analysis
            </p>
          </div>
          <div className="h-[320px] overflow-hidden">
            <OEMBarChart
              selectedCountry={selectedCountry}
              onOEMClick={handleOEMClick}
            />
          </div>
        </div>

        {/* Details Section - Auto height to accommodate content */}
        {showDetails && (
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm min-h-[400px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-medium ${theme.textPrimary}`}>
                {selectedOEM} - Detailed Analysis
              </h3>
              {selectedCountry && (
                <div className={`text-sm ${theme.textMuted}`}>
                  Country: {selectedCountry}
                </div>
              )}
            </div>
            <div className="w-full">
              <LandscapeDetails
                selectedOEM={selectedOEM}
                selectedCountry={selectedCountry}
                onBack={() => setShowDetails(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* AI Snippets Sidebar - 40% */}
      <div className="w-2/5">
        <div className="h-[880px]">
          <AISnippetsSidebar 
            selectedOEM={selectedOEM}
            selectedCountry={selectedCountry}
            oemClickedFromChart={oemClickedFromChart}
          />
        </div>
      </div>
    </div>
  )
}

const PassengerCarsLandscape = () => {
  return (
    <PassengerCarsLayout>
      <LandscapeContent />
    </PassengerCarsLayout>
  )
}

export default PassengerCarsLandscape
