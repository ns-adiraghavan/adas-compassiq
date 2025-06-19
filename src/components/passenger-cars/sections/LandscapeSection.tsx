
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
    <div className={`w-full h-full flex ${theme.backgroundGradient} transition-all duration-500 overflow-hidden`}>
      {/* Main Content Area - 60% */}
      <div className="w-[60%] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="space-y-6 pb-8">
            {/* Countries Section */}
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
              <CountryButtons
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
              />
            </div>

            {/* OEM Bar Chart */}
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
              <div className="mb-4">
                <h3 className={`text-xl font-medium ${theme.textPrimary} mb-2`}>OEM Feature Distribution</h3>
                <p className={`${theme.textMuted} text-sm`}>
                  {selectedCountry ? `Showing feature counts for ${selectedCountry}. ` : ''}
                  Click on any OEM bar to view detailed analysis
                </p>
              </div>
              <div className="h-96">
                <OEMBarChart
                  selectedCountry={selectedCountry}
                  onOEMClick={handleOEMClick}
                />
              </div>
            </div>

            {/* Details Section - Shows below bar chart when OEM is selected */}
            {showDetails && (
              <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
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
      </div>

      {/* AI Snippets Sidebar - 40% */}
      <div className={`w-[40%] flex flex-col ${theme.cardBackground} ${theme.cardBorder} border-l backdrop-blur-sm overflow-hidden`}>
        <div className="flex-1 overflow-auto p-6">
          <AISnippetsSidebar selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
      </div>
    </div>
  )
}

export default LandscapeSection
