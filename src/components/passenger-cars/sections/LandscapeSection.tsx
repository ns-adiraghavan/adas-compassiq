
import { useState, useEffect } from "react"
import { useFirstAvailableOEM } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMBarChart from "../charts/OEMBarChart"
import LandscapeDetails from "../details/LandscapeDetails"
import AISnippetsSidebar from "../AISnippetsSidebar"

const LandscapeSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEM, setSelectedOEM] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const { data: firstOEM } = useFirstAvailableOEM()

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
    <div className="h-full flex w-full">
      {/* Main Content Area - 60% */}
      <div className="w-[60%] flex flex-col px-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-thin mb-4 text-white">Landscape</h2>
        </div>

        {/* Countries Section - Full Width */}
        <div className="mb-6">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <CountryButtons
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>
        </div>

        {/* OEM Bar Chart - Full Width */}
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-xl font-medium text-white mb-2">OEM Feature Distribution</h3>
            <p className="text-gray-400 text-sm">Click on any OEM bar to view detailed analysis</p>
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
          <div className="mb-6">
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

      {/* AI Snippets Sidebar - 40% */}
      <div className="w-[40%] p-4 bg-black/80 backdrop-blur-sm border-l border-gray-800">
        <AISnippetsSidebar />
      </div>
    </div>
  )
}

export default LandscapeSection
