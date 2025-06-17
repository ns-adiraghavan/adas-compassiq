
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
    if (!waypointData?.csvData?.length || !selectedOEM) return []

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
    
    return allRows
  }, [waypointData, selectedOEM, selectedCountry])

  const contextData = useMemo(() => {
    return waypointData?.contextData || []
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

  if (!selectedOEM || filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="text-center">
          <h3 className="text-xl text-white/70 mb-2">No Data Available</h3>
          <p className="text-white/50">
            {!selectedOEM 
              ? "Please select an OEM to view overview insights"
              : `No data found for ${selectedOEM} in ${selectedCountry}`
            }
          </p>
        </div>
      </div>
    )
  }

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
