
import { useState } from "react"
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import CountryButtons from "@/components/CountryButtons"
import OEMSelector from "@/components/passenger-cars/OEMSelector"
import AISnippetsSidebar from "@/components/passenger-cars/AISnippetsSidebar"
import VennDiagram from "@/components/VennDiagram"
import { useVennDiagramData } from "@/hooks/useVennDiagramData"
import { useTheme } from "@/contexts/ThemeContext"

const InsightsContent = () => {
  const { theme } = useTheme()
  const [selectedCountry, setSelectedCountry] = useState("Germany")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])

  const { vennData, isLoading } = useVennDiagramData(selectedCountry, selectedOEMs)

  const handleOEMToggle = (oem: string) => {
    setSelectedOEMs(prev => 
      prev.includes(oem) 
        ? prev.filter(o => o !== oem)
        : [...prev, oem]
    )
  }

  const handleSelectAll = () => {
    // This would be populated by available OEMs for the country
    setSelectedOEMs([])
  }

  const handleClearAll = () => {
    setSelectedOEMs([])
  }

  return (
    <div className={`min-h-screen ${theme.backgroundGradient} transition-all duration-500`}>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Controls Section */}
          <div className="px-8 py-6 space-y-6">
            {/* Country Selection */}
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
              <CountryButtons
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
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
          <div className="flex-1 px-8 pb-8">
            <div className={`h-full ${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
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
        <div className="w-96 border-l border-gray-700">
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
