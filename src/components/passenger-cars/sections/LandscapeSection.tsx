
import { useState, useEffect } from "react"
import { useFirstAvailableOEM } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMBarChart from "../charts/OEMBarChart"
import LandscapeDetails from "../details/LandscapeDetails"

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
    <div className="h-full flex flex-col">
      {!showDetails ? (
        <>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-thin mb-4 text-white">Landscape</h2>
          </div>

          {/* Countries Section - Horizontal */}
          <div className="mb-6">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <CountryButtons
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
              />
            </div>
          </div>

          {/* OEM Bar Chart */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-medium text-white mb-2">OEM Feature Distribution</h3>
              <p className="text-gray-400 text-sm">Click on any OEM bar to view detailed analysis</p>
            </div>
            <OEMBarChart
              selectedCountry={selectedCountry}
              onOEMClick={handleOEMClick}
            />
          </div>
        </>
      ) : (
        <LandscapeDetails
          selectedOEM={selectedOEM}
          selectedCountry={selectedCountry}
          onBack={() => setShowDetails(false)}
        />
      )}
    </div>
  )
}

export default LandscapeSection
