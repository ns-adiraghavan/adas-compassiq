import { useState, useEffect } from "react"
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import CountryButtons from "@/components/CountryButtons"
import OEMSelector from "@/components/passenger-cars/OEMSelector"
import AISnippetsSidebar from "@/components/AISnippetsSidebar"
import VennDiagram from "@/components/VennDiagram"
import { useVennDiagramData } from "@/hooks/useVennDiagramData"
import { useTheme } from "@/contexts/ThemeContext"
import { useWaypointData } from "@/hooks/useWaypointData"

const InsightsContent = () => {
  const { theme } = useTheme()
  const [selectedCountry, setSelectedCountry] = useState("Germany")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])
  const { data: waypointData } = useWaypointData()

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

  useEffect(() => {
    if (waypointData?.csvData?.length) {
      const availableOEMs = getAvailableOEMs(selectedCountry)
      setSelectedOEMs(availableOEMs.slice(0, 3))
    }
  }, [selectedCountry, waypointData])

  const { vennData, isLoading } = useVennDiagramData(selectedCountry, selectedOEMs)

  const handleOEMToggle = (oem: string) => {
    setSelectedOEMs(prev => 
      prev.includes(oem) 
        ? prev.filter(o => o !== oem)
        : prev.length < 3 
          ? [...prev, oem]
          : prev
    )
  }

  const handleSelectAll = () => {
    const availableOEMs = getAvailableOEMs(selectedCountry)
    setSelectedOEMs(availableOEMs.slice(0, 3))
  }

  const handleClearAll = () => {
    setSelectedOEMs([])
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
  }

  return (
    <div className={`w-full min-h-screen flex ${theme.backgroundGradient} transition-all duration-500`} style={{ overflow: 'hidden' }}>
      {/* Main Content Area - 60% with proper alignment */}
      <div className="flex-shrink-0 overflow-y-auto" style={{ width: '60%', maxWidth: '60%', minWidth: '60%' }}>
        <div className="px-8 py-6 space-y-6 pb-8" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Controls Section */}
          <div className="space-y-6">
            {/* Country Selection */}
            <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
              <CountryButtons
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
              />
            </div>

            {/* OEM Selection - WITH showSelectFirst3 prop set to true */}
            <OEMSelector
              selectedCountry={selectedCountry}
              selectedOEMs={selectedOEMs}
              onOEMToggle={handleOEMToggle}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              showSelectFirst3={true}
            />
          </div>

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

      {/* AI Snippets Sidebar - 40% with proper alignment */}
      <div 
        className="flex-shrink-0 min-h-screen"
        style={{ 
          width: '40%',
          maxWidth: '40%',
          minWidth: '40%',
          overflow: 'hidden',
          position: 'relative',
          paddingRight: '32px'
        }}
      >
        <AISnippetsSidebar
          selectedOEM={selectedOEMs.join(", ")}
          selectedCountry={selectedCountry}
        />
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
