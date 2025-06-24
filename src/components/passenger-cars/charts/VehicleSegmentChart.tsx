
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useVehicleSegmentData } from "./hooks/useVehicleSegmentData"
import VehicleSegmentControls from "./components/VehicleSegmentControls"
import VehicleSegmentBarChart from "./components/VehicleSegmentBarChart"
import VehicleSegmentTable from "./components/VehicleSegmentTable"
import type { VehicleSegmentChartProps, ViewMode, GroupingMode } from "./types/VehicleSegmentTypes"

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('grouped')
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('by-oem')

  const { chartData, availableSegments, hasData, debugInfo, segmentFeatureMap, oemFeatureMap } = 
    useVehicleSegmentData(selectedCountry, selectedOEMs, groupingMode)

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
      {/* Controls */}
      <VehicleSegmentControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        groupingMode={groupingMode}
        onGroupingModeChange={setGroupingMode}
      />

      {/* Title */}
      <div>
        <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
          Features {groupingMode === 'by-oem' ? 'by OEM and Vehicle Segment' : 'by Vehicle Segment and OEM'}
        </h4>
        <p className={`${theme.textMuted} text-sm`}>
          {groupingMode === 'by-oem' 
            ? 'Number of features for each OEM, grouped by vehicle segments'
            : 'Number of features for each vehicle segment, grouped by OEM manufacturers'
          }
        </p>
      </div>

      {/* Visualization */}
      <div className="min-h-[400px]">
        {viewMode === 'grouped' ? (
          <VehicleSegmentBarChart
            chartData={chartData}
            availableSegments={availableSegments}
            selectedOEMs={selectedOEMs}
            groupingMode={groupingMode}
          />
        ) : (
          <VehicleSegmentTable
            availableSegments={availableSegments}
            selectedOEMs={selectedOEMs}
            groupingMode={groupingMode}
            segmentFeatureMap={segmentFeatureMap}
            oemFeatureMap={oemFeatureMap}
          />
        )}
      </div>
    </div>
  )
}

export default VehicleSegmentChart
