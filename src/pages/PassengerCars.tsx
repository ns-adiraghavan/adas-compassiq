
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import WaypointLogo from "@/components/WaypointLogo"
import OEMButtons from "@/components/OEMButtons"
import CountryButtons from "@/components/CountryButtons"
import InsightsSection from "@/components/InsightsSection"
import { useFirstAvailableOEM } from "@/hooks/useWaypointData"

const PassengerCars = () => {
  const { data: firstOEM, isLoading: isLoadingFirstOEM } = useFirstAvailableOEM()
  const [selectedOEM, setSelectedOEM] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("Global")
  const [selectedInsight, setSelectedInsight] = useState("Overview")

  // Set the first available OEM as default when data is loaded
  useEffect(() => {
    if (firstOEM && !selectedOEM) {
      setSelectedOEM(firstOEM)
    }
  }, [firstOEM, selectedOEM])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <WaypointLogo />
        </div>
        <h1 className="text-2xl font-bold">Passenger Cars Intelligence</h1>
      </header>

      {/* OEM Buttons Row */}
      <div className="px-6 py-4 border-b border-gray-800">
        {isLoadingFirstOEM ? (
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-400 mr-4 flex items-center">OEMs:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <OEMButtons selectedOEM={selectedOEM} onOEMChange={setSelectedOEM} />
        )}
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Country Sidebar */}
        <aside className="w-64 border-r border-gray-800 p-6">
          <CountryButtons selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
        </aside>

        {/* Insights Content */}
        <main className="flex-1 p-6">
          <InsightsSection 
            selectedInsight={selectedInsight}
            onInsightChange={setSelectedInsight}
            selectedOEM={selectedOEM}
            selectedCountry={selectedCountry}
          />
        </main>
      </div>
    </div>
  )
}

export default PassengerCars
