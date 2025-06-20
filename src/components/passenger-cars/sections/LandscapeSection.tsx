import { useState, useEffect } from "react"
import { useFirstAvailableOEM, useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMBarChart from "../charts/OEMBarChart"
import LandscapeDetails from "../details/LandscapeDetails"
import AISnippetsSidebar from "../AISnippetsSidebar"
import { useTheme } from "@/contexts/ThemeContext"

const LandscapeSection = () => {
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
    <div className={`w-full min-h-screen flex ${theme.backgroundGradient} transition-all duration-500`} style={{ overflow: 'hidden' }}>
      {/* Main Content Area - 60% with proper alignment */}
      <div className="flex-shrink-0 overflow-y-auto" style={{ width: '60%', maxWidth: '60%', minWidth: '60%' }}>
        <div className="px-8 py-6 space-y-6 pb-8" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Countries Section */}
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full max-w-full`}>
            <CountryButtons
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
          </div>

          {/* OEM Bar Chart */}
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full max-w-full`}>
            <div className="mb-4">
              <h3 className={`text-xl font-medium ${theme.textPrimary} mb-2`}>OEM Feature Distribution</h3>
              <p className={`${theme.textMuted} text-sm`}>
                {selectedCountry ? `Showing feature counts for ${selectedCountry}. ` : ''}
                Click on any OEM bar to view detailed analysis
              </p>
            </div>
            <div className="h-96 w-full max-w-full">
              <OEMBarChart
                selectedCountry={selectedCountry}
                onOEMClick={handleOEMClick}
              />
            </div>
          </div>

          {/* Details Section - Shows below bar chart when OEM is selected */}
          {showDetails && (
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm w-full max-w-full`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-medium ${theme.textPrimary}`}>
                  {selectedOEM} - Detailed Analysis
                </h3>
                {selectedCountry && (
                  <div className={`text-sm ${theme.textMuted}`}>
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

      {/* AI Snippets Sidebar - 40% with clean transparent container */}
      <div 
        className="flex-shrink-0 min-h-screen"
        style={{ 
          width: '40%',
          maxWidth: '40%',
          minWidth: '40%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <AISnippetsSidebar />
      </div>
    </div>
  )
}

export default LandscapeSection
