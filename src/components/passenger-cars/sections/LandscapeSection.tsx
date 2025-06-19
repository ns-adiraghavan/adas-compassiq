
import { useState, useEffect } from "react"
import { useFirstAvailableOEM, useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMBarChart from "../charts/OEMBarChart"
import LandscapeDetails from "../details/LandscapeDetails"
import AISnippetsSidebar from "../AISnippetsSidebar"

const LandscapeSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEM, setSelectedOEM] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const { data: firstOEM } = useFirstAvailableOEM()
  const { data: waypointData } = useWaypointData()

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

  return (
    <div className="w-full min-h-full flex">
      {/* Main Content Area - 60% */}
      <div className="w-[60%] px-8">
        <div className="space-y-6 pb-8">
          {/* Countries Section */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <CountryButtons
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>

          {/* OEM Bar Chart */}
          <div className="bg-gray-800/30 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-medium text-white mb-2">OEM Feature Distribution</h3>
              <p className="text-gray-400 text-sm">
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
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white">
                  {selectedOEM} - Detailed Analysis
                </h3>
                {selectedCountry && (
                  <div className="text-sm text-gray-400">
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

      {/* AI Snippets Sidebar - 40% */}
      <div className="w-[40%] p-6 bg-gray-900/30 border-l border-gray-800">
        <AISnippetsSidebar />
      </div>
    </div>
  )
}

export default LandscapeSection
