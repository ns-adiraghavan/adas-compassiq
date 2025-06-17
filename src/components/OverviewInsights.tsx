
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"
import OEMProfileCard from "./overview/OEMProfileCard"
import MetricsGrid from "./overview/MetricsGrid"
import FeatureLandscape from "./overview/FeatureLandscape"
import MarketIntelligence from "./overview/MarketIntelligence"
import DataInsights from "./overview/DataInsights"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const filteredData = useMemo(() => {
    console.log('Overview - Processing data for:', { selectedOEM, selectedCountry })
    console.log('Overview - Waypoint data:', waypointData)
    
    if (!waypointData?.csvData?.length || !selectedOEM) {
      console.log('Overview - No data or OEM selected')
      return []
    }

    const allRows: any[] = []
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const matchesOEM = row.OEM === selectedOEM
          const matchesCountry = selectedCountry === "Global" || row.Country === selectedCountry
          
          if (matchesOEM && matchesCountry) {
            allRows.push(row)
          }
        })
      }
    })
    
    console.log('Overview - Filtered data rows:', allRows.length)
    return allRows
  }, [waypointData, selectedOEM, selectedCountry])

  const contextData = useMemo(() => {
    const context = waypointData?.contextData || []
    console.log('Overview - Context data:', context)
    return context
  }, [waypointData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-48 bg-gray-800/50 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!selectedOEM) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="text-center">
          <h3 className="text-xl text-white/70 mb-2">No OEM Selected</h3>
          <p className="text-white/50">
            Please select an OEM to view overview insights
          </p>
        </div>
      </div>
    )
  }

  // Show overview even with limited data
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-light text-white mb-2">
          {selectedOEM} Overview
        </h2>
        <p className="text-white/60 font-light">
          Comprehensive analysis of connected services and market presence
          {selectedCountry !== "Global" && ` in ${selectedCountry}`}
        </p>
        {filteredData.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              Limited data available for {selectedOEM} 
              {selectedCountry !== "Global" && ` in ${selectedCountry}`}. 
              Showing general insights and available information.
            </p>
          </div>
        )}
      </div>

      {/* OEM Profile and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OEMProfileCard 
            selectedOEM={selectedOEM} 
            selectedCountry={selectedCountry}
            filteredData={filteredData}
            contextData={contextData}
          />
        </div>
        <div className="lg:col-span-1">
          <MetricsGrid 
            selectedOEM={selectedOEM}
            selectedCountry={selectedCountry}
            filteredData={filteredData}
          />
        </div>
      </div>

      {/* Feature Landscape */}
      <FeatureLandscape 
        selectedOEM={selectedOEM}
        selectedCountry={selectedCountry}
        filteredData={filteredData}
      />

      {/* Market Intelligence and Data Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketIntelligence 
          selectedOEM={selectedOEM}
          selectedCountry={selectedCountry}
          contextData={contextData}
        />
        <DataInsights 
          selectedOEM={selectedOEM}
          selectedCountry={selectedCountry}
          filteredData={filteredData}
        />
      </div>
    </div>
  )
}

export default OverviewInsights
