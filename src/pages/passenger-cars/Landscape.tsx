
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
  const { data: firstOEM } = useFirstAvailableOEM()
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  // Set default country when data is loaded
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
    }
  }, [firstOEM, selectedOEM])

  const handleOEMClick = (oem: string) => {
    setSelectedOEM(oem)
    setShowDetails(true)
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    // Hide details when country changes since no OEM is selected
    setShowDetails(false)
    setSelectedOEM("")
  }

  return (
    <div className={`w-full h-full flex ${theme.backgroundGradient} transition-all duration-500`} style={{ overflow: 'hidden' }}>
      {/* Main Content Area - 60% with proper alignment */}
      <div className="flex-shrink-0" style={{ width: '60%', maxWidth: '60%', minWidth: '60%', height: '100%', overflow: 'hidden' }}>
        <div className="px-8 py-4 h-full flex flex-col" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Countries Section - Fixed height */}
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-4 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full max-w-full flex-shrink-0`} style={{ height: '80px' }}>
            <CountryButtons
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
          </div>

          {/* OEM Bar Chart - Flexible height */}
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-4 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full max-w-full mt-4 flex-1`} style={{ minHeight: showDetails ? '200px' : '300px' }}>
            <div className="mb-3">
              <h3 className={`text-lg font-medium ${theme.textPrimary} mb-1`}>OEM Feature Distribution</h3>
              <p className={`${theme.textMuted} text-xs`}>
                {selectedCountry ? `Showing feature counts for ${selectedCountry}. ` : ''}
                Click on any OEM bar to view detailed analysis
              </p>
            </div>
            <div className="h-full w-full max-w-full" style={{ height: showDetails ? '140px' : '240px' }}>
              <OEMBarChart
                selectedCountry={selectedCountry}
                onOEMClick={handleOEMClick}
              />
            </div>
          </div>

          {/* Details Section - Shows below bar chart when OEM is selected */}
          {showDetails && (
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-4 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full max-w-full mt-4 flex-1`} style={{ minHeight: '300px' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${theme.textPrimary}`}>
                  {selectedOEM} - Detailed Analysis
                </h3>
                {selectedCountry && (
                  <div className={`text-xs ${theme.textMuted}`}>
                    Country: {selectedCountry}
                  </div>
                )}
              </div>
              <LandscapeDetails
                selectedOEM={selectedOEM}
                selectedCountry={selectedCountry}
                onBack={() => setShowDetails(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* AI Snippets Sidebar - 40% with proper alignment */}
      <div 
        className="flex-shrink-0"
        style={{ 
          width: '40%',
          maxWidth: '40%',
          minWidth: '40%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          paddingRight: '32px'
        }}
      >
        <AISnippetsSidebar />
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
