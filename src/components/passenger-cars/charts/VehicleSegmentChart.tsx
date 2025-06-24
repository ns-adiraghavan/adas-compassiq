
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useVehicleSegmentData } from "./hooks/useVehicleSegmentData"
import VehicleSegmentControls from "./components/VehicleSegmentControls"
import VehicleSegmentBarChart from "./components/VehicleSegmentBarChart"
import VehicleSegmentTable from "./components/VehicleSegmentTable"
import VehicleSegmentDetailTable from "./components/VehicleSegmentDetailTable"
import VehicleSegmentCategoryTable from "./components/VehicleSegmentCategoryTable"
import type { VehicleSegmentChartProps, ViewMode, GroupingMode, BarClickData } from "./types/VehicleSegmentTypes"

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('grouped')
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('by-oem')
  const [selectedBarItem, setSelectedBarItem] = useState<BarClickData | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const { chartData, availableSegments, hasData, debugInfo, segmentFeatureMap, oemFeatureMap, detailedFeatureData } = 
    useVehicleSegmentData(selectedCountry, selectedOEMs, groupingMode)

  const handleBarClick = (data: BarClickData) => {
    setSelectedBarItem(data)
  }

  const handleCloseDetail = () => {
    setSelectedBarItem(null)
  }

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const getDetailedData = () => {
    if (!selectedBarItem) return []
    return detailedFeatureData.get(selectedBarItem.name) || []
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
          {viewMode === 'table' 
            ? `Category Analysis - ${groupingMode === 'by-oem' ? 'by OEM' : 'by Segment'}`
            : `Features ${groupingMode === 'by-oem' ? 'by OEM and Vehicle Segment' : 'by Vehicle Segment and OEM'}`
          }
        </h4>
        <p className={`${theme.textMuted} text-sm`}>
          {viewMode === 'table'
            ? `Showing available feature counts by category for selected ${groupingMode === 'by-oem' ? 'OEMs' : 'segments'} in ${selectedCountry}. Click on a category to view detailed features.`
            : groupingMode === 'by-oem' 
              ? 'Number of features for each OEM, grouped by vehicle segments. Click on any bar to see detailed features.'
              : 'Number of features for each vehicle segment, grouped by OEM manufacturers. Click on any bar to see detailed features.'
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
            onBarClick={handleBarClick}
          />
        ) : viewMode === 'table' && chartData.length > 0 ? (
          <VehicleSegmentCategoryTable
            selectedCountry={selectedCountry}
            selectedOEMs={selectedOEMs}
            groupingMode={groupingMode}
            expandedCategory={expandedCategory}
            onCategoryClick={handleCategoryClick}
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

      {/* Detailed Feature Table (only for chart view) */}
      {viewMode === 'grouped' && selectedBarItem && (
        <VehicleSegmentDetailTable
          selectedItem={selectedBarItem.name}
          itemType={selectedBarItem.type}
          detailedData={getDetailedData()}
          groupingMode={groupingMode}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}

export default VehicleSegmentChart
