
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
      {/* Main Content Area - 60% */}
      <div className="flex-shrink-0" style={{ width: '60%', height: '100%', overflow: 'hidden' }}>
        <div className="px-6 py-4 h-full flex flex-col" style={{ boxSizing: 'border-box' }}>
          {/* Countries Section - Fixed height with proper spacing */}
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full flex-shrink-0 mb-4`} style={{ height: '120px' }}>
            <CountryButtons
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
          </div>

          {/* OEM Bar Chart - Adjustable height based on details visibility */}
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full flex-shrink-0 mb-4`} style={{ height: showDetails ? '280px' : '400px' }}>
            <div className="mb-4">
              <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>OEM Feature Distribution</h3>
              <p className={`${theme.textMuted} text-sm`}>
                {selectedCountry ? `Showing feature counts for ${selectedCountry}. ` : ''}
                Click on any OEM bar to view detailed analysis
              </p>
            </div>
            <div className="w-full" style={{ height: 'calc(100% - 80px)' }}>
              <OEMBarChart
                selectedCountry={selectedCountry}
                onOEMClick={handleOEMClick}
              />
            </div>
          </div>

          {/* Details Section - Shows when OEM is selected */}
          {showDetails && (
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full flex-1`} style={{ minHeight: '320px' }}>
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
              <div style={{ height: 'calc(100% - 60px)' }}>
                <LandscapeDetails
                  selectedOEM={selectedOEM}
                  selectedCountry={selectedCountry}
                  onBack={() => setShowDetails(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Snippets Sidebar - 40% */}
      <div 
        className="flex-shrink-0"
        style={{ 
          width: '40%',
          height: '100%',
          overflow: 'hidden',
          paddingRight: '24px',
          paddingTop: '16px'
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
