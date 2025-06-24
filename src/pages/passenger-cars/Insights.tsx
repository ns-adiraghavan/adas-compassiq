
import { useState, useEffect } from "react"
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import CountryButtons from "@/components/CountryButtons"
import OEMSelector from "@/components/passenger-cars/OEMSelector"
import AISnippetsSidebar from "@/components/passenger-cars/AISnippetsSidebar"
import VennDiagram from "@/components/VennDiagram"
import { useVennDiagramData } from "@/hooks/useVennDiagramData"
import { useTheme } from "@/contexts/ThemeContext"
import { useWaypointData } from "@/hooks/useWaypointData"

const InsightsContent = () => {
  const { theme } = useTheme()
  const [selectedCountry, setSelectedCountry] = useState("Germany")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])
  const { data: waypointData } = useWaypointData()

  // Get available OEMs for the selected country
  const getAvailableOEMs = (country: string) => {
    if (!waypointData?.csvData?.length || !country) return []

    const uniqueOEMs = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === country &&
              row.OEM && typeof row.OEM === 'string' && 
              row.OEM.trim() !== '' && 
              !row.OEM.toLowerCase().includes('merged') &&
              !row.OEM.toLowerCase().includes('monitoring') &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available') {
            uniqueOEMs.add(row.OEM.trim())
          }
        })
      }
    })

    return Array.from(uniqueOEMs).sort()
  }

  // Auto-select all OEMs when country changes
  useEffect(() => {
    if (waypointData?.csvData?.length) {
      const availableOEMs = getAvailableOEMs(selectedCountry)
      setSelectedOEMs(availableOEMs)
    }
  }, [selectedCountry, waypointData])

  const { vennData, isLoading } = useVennDiagramData(selectedCountry, selectedOEMs)

  const handleOEMToggle = (oem: string) => {
    setSelectedOEMs(prev => 
      prev.includes(oem) 
        ? prev.filter(o => o !== oem)
        : [...prev, oem]
    )
  }

  const handleSelectAll = () => {
    const availableOEMs = getAvailableOEMs(selectedCountry)
    setSelectedOEMs(availableOEMs)
  }

  const handleClearAll = () => {
    setSelectedOEMs([])
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    // OEMs will be auto-selected via useEffect
  }

  return (
    <div className={`min-h-screen ${theme.backgroundGradient} transition-all duration-500`}>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Controls Section */}
          <div className="px-8 py-6 space-y-6">
            {/* Country Selection */}
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
              <CountryButtons
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
              />
            </div>

            {/* OEM Selection */}
            <OEMSelector
              selectedCountry={selectedCountry}
              selectedOEMs={selectedOEMs}
              onOEMToggle={handleOEMToggle}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Venn Diagram Section */}
          <div className="px-8 pb-8">
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
              <h2 className={`text-2xl font-light mb-6 ${theme.textPrimary}`}>
                Feature Overlap Analysis
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : vennData ? (
                <VennDiagram data={vennData} />
              ) : (
                <div className={`flex items-center justify-center h-96 ${theme.textMuted}`}>
                  <p>Select OEMs to view feature overlap analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="w-96 border-l border-gray-700 flex-shrink-0">
          <AISnippetsSidebar
            selectedOEM={selectedOEMs.join(", ")}
            selectedCountry={selectedCountry}
          />
        </div>
      </div>
    </div>
  )
}

const PassengerCarsInsights = () => {
  return (
    <PassengerCarsLayout>
      <InsightsContent />
    </PassengerCarsLayout>
  )
}

export default PassengerCarsInsights
