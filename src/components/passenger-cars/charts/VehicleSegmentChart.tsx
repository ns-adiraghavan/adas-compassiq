import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"

interface VehicleSegmentChartProps {
  selectedCountry: string
  selectedOEMs: string[]
}

type ViewMode = 'grouped' | 'table'
type GroupingMode = 'by-oem' | 'by-segment'

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('grouped')
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('by-oem')

  const processVehicleSegmentData = () => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { chartData: [], availableSegments: [], hasData: false, debugInfo: {} }
    }

    console.log('Processing vehicle segment data for:', { selectedCountry, selectedOEMs })

    const segmentFeatureMap = new Map<string, Map<string, number>>()
    const oemFeatureMap = new Map<string, Map<string, number>>()
    const availableSegments = new Set<string>()
    
    let detectedSegmentColumns: string[] = []
    let debugInfo: any = {
      totalRows: 0,
      processedRows: 0,
      availableColumns: [],
      segmentColumns: [],
      sampleData: []
    }

    // Analyze available columns
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data) && file.data.length > 0) {
        const firstRow = file.data[0]
        const allColumns = Object.keys(firstRow)
        debugInfo.availableColumns = allColumns
        
        console.log('All available columns:', allColumns)
        
        // Look for segment-related columns
        const segmentPatterns = [
          /segment/i, /entry/i, /mid/i, /premium/i, /luxury/i, /basic/i, /standard/i, /high/i, /executive/i
        ]
        
        allColumns.forEach(column => {
          if (segmentPatterns.some(pattern => pattern.test(column))) {
            detectedSegmentColumns.push(column)
          }
        })
        
        debugInfo.segmentColumns = detectedSegmentColumns
        debugInfo.sampleData = file.data.slice(0, 3)
      }
    })

    console.log('Detected segment columns:', detectedSegmentColumns)

    // Process data
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          debugInfo.totalRows++
          
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            debugInfo.processedRows++
            const oem = row.OEM.toString().trim()
            const feature = row.Feature.toString().trim()
            
            // Check segment columns
            if (detectedSegmentColumns.length > 0) {
              detectedSegmentColumns.forEach(segmentCol => {
                const segmentValue = row[segmentCol]?.toString().trim().toLowerCase()
                
                if (segmentValue && segmentValue !== 'n/a' && segmentValue !== '' && 
                    (segmentValue === 'yes' || segmentValue === 'y' || segmentValue === '1' || 
                     segmentValue === 'true' || segmentValue === 'available')) {
                  
                  let segmentName = segmentCol.replace(/segment/i, '').trim()
                  if (segmentName.toLowerCase().includes('entry')) segmentName = 'Entry'
                  else if (segmentName.toLowerCase().includes('mid')) segmentName = 'Mid'
                  else if (segmentName.toLowerCase().includes('premium')) segmentName = 'Premium'
                  else if (segmentName.toLowerCase().includes('luxury')) segmentName = 'Luxury'
                  else segmentName = segmentCol
                  
                  availableSegments.add(segmentName)
                  
                  // Update segment → OEM mapping
                  if (!segmentFeatureMap.has(segmentName)) {
                    segmentFeatureMap.set(segmentName, new Map())
                  }
                  const segmentOEMs = segmentFeatureMap.get(segmentName)!
                  segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
                  
                  // Update OEM → segment mapping
                  if (!oemFeatureMap.has(oem)) {
                    oemFeatureMap.set(oem, new Map())
                  }
                  const oemSegments = oemFeatureMap.get(oem)!
                  oemSegments.set(segmentName, (oemSegments.get(segmentName) || 0) + 1)
                }
              })
            } else {
              // Fallback to category-based segmentation
              const category = row.Category?.toString().trim() || 'General'
              availableSegments.add(category)
              
              if (!segmentFeatureMap.has(category)) {
                segmentFeatureMap.set(category, new Map())
              }
              const segmentOEMs = segmentFeatureMap.get(category)!
              segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
              
              if (!oemFeatureMap.has(oem)) {
                oemFeatureMap.set(oem, new Map())
              }
              const oemSegments = oemFeatureMap.get(oem)!
              oemSegments.set(category, (oemSegments.get(category) || 0) + 1)
            }
          }
        })
      }
    })

    const segments = Array.from(availableSegments).sort()
    console.log('Final processing results:', { segments, debugInfo })

    // Build chart data based on grouping mode
    let chartData: any[] = []
    
    if (groupingMode === 'by-oem') {
      // Group by OEM (OEMs on X-axis, segments as separate bars)
      chartData = selectedOEMs.map(oem => {
        const item: any = { name: oem }
        const oemSegments = oemFeatureMap.get(oem) || new Map()
        
        segments.forEach(segment => {
          item[segment] = oemSegments.get(segment) || 0
        })
        
        return item
      }).filter(item => segments.some(segment => item[segment] > 0))
    } else {
      // Group by segment (Segments on X-axis, OEMs as separate bars)
      chartData = segments.map(segment => {
        const item: any = { name: segment }
        const segmentOEMs = segmentFeatureMap.get(segment) || new Map()
        
        selectedOEMs.forEach(oem => {
          item[oem] = segmentOEMs.get(oem) || 0
        })
        
        return item
      }).filter(item => selectedOEMs.some(oem => item[oem] > 0))
    }

    return { 
      chartData, 
      availableSegments: segments, 
      hasData: chartData.length > 0,
      debugInfo,
      segmentFeatureMap,
      oemFeatureMap
    }
  }

  const { chartData, availableSegments, hasData, debugInfo, segmentFeatureMap, oemFeatureMap } = useMemo(() => {
    return processVehicleSegmentData()
  }, [waypointData, selectedCountry, selectedOEMs, groupingMode])

  const segmentColors: Record<string, string> = {
    'Entry': '#ef4444',
    'Mid': '#f97316', 
    'Premium': '#eab308',
    'Luxury': '#10b981'
  }

  const oemColors: string[] = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

  const renderGroupedBarChart = () => {
    const dataKeys = groupingMode === 'by-oem' ? availableSegments : selectedOEMs
    const colors = groupingMode === 'by-oem' ? segmentColors : oemColors

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: theme.textSecondary.includes('text-gray-400') ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: theme.textSecondary.includes('text-gray-400') ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.cardBackground.includes('bg-gray-800') ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: theme.textPrimary.includes('text-white') ? '#ffffff' : '#000000',
            }}
            formatter={(value: any, name: string) => [
              `${Number(value)} features`,
              name
            ]}
          />
          <Legend />
          {dataKeys.map((key, index) => {
            let barColor: string
            if (groupingMode === 'by-oem') {
              barColor = segmentColors[key] || '#8b5cf6'
            } else {
              barColor = oemColors[index % oemColors.length] || '#8b5cf6'
            }
            
            return (
              <Bar
                key={key}
                dataKey={key}
                fill={barColor}
                name={key}
              />
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderTable = () => {
    if (groupingMode === 'by-oem') {
      return (
        <div className="overflow-x-auto">
          <table className={`w-full ${theme.cardBorder} border rounded-lg`}>
            <thead className={`${theme.cardBackground}`}>
              <tr>
                <th className={`px-4 py-2 text-left ${theme.textPrimary}`}>OEM</th>
                {availableSegments.map(segment => (
                  <th key={segment} className={`px-4 py-2 text-center ${theme.textPrimary}`}>
                    {segment}
                  </th>
                ))}
                <th className={`px-4 py-2 text-center ${theme.textPrimary}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOEMs.map(oem => {
                const oemSegments = oemFeatureMap?.get(oem) || new Map()
                const total = availableSegments.reduce((sum, segment) => sum + (oemSegments.get(segment) || 0), 0)
                return (
                  <tr key={oem} className={`${theme.cardBorder} border-t`}>
                    <td className={`px-4 py-2 font-medium ${theme.textPrimary}`}>{oem}</td>
                    {availableSegments.map(segment => (
                      <td key={segment} className={`px-4 py-2 text-center ${theme.textSecondary}`}>
                        {oemSegments.get(segment) || 0}
                      </td>
                    ))}
                    <td className={`px-4 py-2 text-center font-medium ${theme.textPrimary}`}>
                      {total}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className="overflow-x-auto">
          <table className={`w-full ${theme.cardBorder} border rounded-lg`}>
            <thead className={`${theme.cardBackground}`}>
              <tr>
                <th className={`px-4 py-2 text-left ${theme.textPrimary}`}>Segment</th>
                {selectedOEMs.map(oem => (
                  <th key={oem} className={`px-4 py-2 text-center ${theme.textPrimary}`}>
                    {oem}
                  </th>
                ))}
                <th className={`px-4 py-2 text-center ${theme.textPrimary}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {availableSegments.map(segment => {
                const segmentOEMs = segmentFeatureMap?.get(segment) || new Map()
                const total = selectedOEMs.reduce((sum, oem) => sum + (segmentOEMs.get(oem) || 0), 0)
                return (
                  <tr key={segment} className={`${theme.cardBorder} border-t`}>
                    <td className={`px-4 py-2 font-medium ${theme.textPrimary}`}>{segment}</td>
                    {selectedOEMs.map(oem => (
                      <td key={oem} className={`px-4 py-2 text-center ${theme.textSecondary}`}>
                        {segmentOEMs.get(oem) || 0}
                      </td>
                    ))}
                    <td className={`px-4 py-2 text-center font-medium ${theme.textPrimary}`}>
                      {total}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
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
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme.textSecondary}`}>View:</span>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
              <ToggleGroupItem value="grouped">Chart</ToggleGroupItem>
              <ToggleGroupItem value="table">Table</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme.textSecondary}`}>Group by:</span>
            <ToggleGroup type="single" value={groupingMode} onValueChange={(value) => value && setGroupingMode(value as GroupingMode)}>
              <ToggleGroupItem value="by-oem">OEM</ToggleGroupItem>
              <ToggleGroupItem value="by-segment">Segment</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

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
        {viewMode === 'grouped' ? renderGroupedBarChart() : renderTable()}
      </div>
    </div>
  )
}

export default VehicleSegmentChart
