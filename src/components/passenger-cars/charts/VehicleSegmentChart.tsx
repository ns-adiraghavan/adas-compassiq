
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useVehicleSegmentData } from "./hooks/useVehicleSegmentData"
import VehicleSegmentControls from "./components/VehicleSegmentControls"
import VehicleSegmentCategoryTable from "./components/VehicleSegmentCategoryTable"
import type { VehicleSegmentChartProps, GroupingMode } from "./types/VehicleSegmentTypes"

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { theme } = useTheme()
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('by-oem')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const { chartData, availableSegments, hasData, debugInfo } = 
    useVehicleSegmentData(selectedCountry, selectedOEMs, groupingMode)

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  if (!hasData) {
    return (
      <div className={`h-full flex items-center justify-center ${theme.textMuted}`}>
        <div className="text-center">
          <p>No vehicle segment data available for the selected filters</p>
          <p className="text-sm mt-2">Selected Country: {selectedCountry}</p>
          <p className="text-sm">Selected OEMs: {selectedOEMs.join(', ')}</p>
          <div className="mt-4 text-xs">
            <p>Debug Info:</p>
            <p>Total rows: {debugInfo.totalRows}</p>
            <p>Processed rows: {debugInfo.processedRows}</p>
            <p>Available segments: {availableSegments.join(', ')}</p>
            <p>Detected columns: {debugInfo.segmentColumns?.join(', ')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls - Only Group by selector */}
      <VehicleSegmentControls
        groupingMode={groupingMode}
        onGroupingModeChange={setGroupingMode}
      />

      {/* Title */}
      <div>
        <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
          Category Analysis - {groupingMode === 'by-oem' ? 'by OEM' : 'by Segment'}
        </h4>
        <p className={`${theme.textMuted} text-sm`}>
          Showing available feature counts by category for selected {groupingMode === 'by-oem' ? 'OEMs' : 'segments'} in {selectedCountry}. Click on a category to view detailed features.
        </p>
      </div>

      {/* Table View */}
      <div className="min-h-[400px]">
        <VehicleSegmentCategoryTable
          selectedCountry={selectedCountry}
          selectedOEMs={selectedOEMs}
          groupingMode={groupingMode}
          expandedCategory={expandedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>
    </div>
  )
}

export default VehicleSegmentChart
