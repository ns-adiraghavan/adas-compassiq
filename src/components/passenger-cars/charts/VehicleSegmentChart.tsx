
import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"

interface VehicleSegmentChartProps {
  selectedCountry: string
  selectedOEMs: string[]
}

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const processVehicleSegmentData = () => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { oemChartData: [], segmentChartData: [], availableSegments: [] }
    }

    console.log('Processing vehicle segment data for:', { selectedCountry, selectedOEMs })

    // Dual mapping: OEM → Segments → Feature Count and Segments → OEM → Feature Count
    const oemSegmentMap = new Map<string, Map<string, number>>() // OEM → Segment → Count
    const segmentOemMap = new Map<string, Map<string, number>>() // Segment → OEM → Count
    const availableSegments = new Set<string>()

    // Let's first detect what segment-related columns are actually available
    let detectedSegmentColumns: string[] = []
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data) && file.data.length > 0) {
        const firstRow = file.data[0]
        const allColumns = Object.keys(firstRow)
        console.log('All available columns in CSV:', allColumns)
        
        // Look for segment-related columns with various possible names
        const segmentPatterns = [
          /^entry$/i, /^mid$/i, /^premium$/i, /^luxury$/i,
          /entry.?level/i, /mid.?range/i, /premium.?segment/i, /luxury.?segment/i,
          /segment.?entry/i, /segment.?mid/i, /segment.?premium/i, /segment.?luxury/i,
          /^e$/i, /^m$/i, /^p$/i, /^l$/i, // Single letter variants
          /basic/i, /standard/i, /high.?end/i, /executive/i
        ]
        
        const segmentMappings: Record<string, string> = {
          'entry': 'Entry',
          'e': 'Entry', 
          'basic': 'Entry',
          'mid': 'Mid',
          'm': 'Mid',
          'standard': 'Mid',
          'premium': 'Premium', 
          'p': 'Premium',
          'luxury': 'Luxury',
          'l': 'Luxury',
          'executive': 'Luxury',
          'high-end': 'Luxury'
        }
        
        allColumns.forEach(column => {
          const columnLower = column.toLowerCase().trim()
          
          // Direct mapping check
          if (segmentMappings[columnLower]) {
            if (!detectedSegmentColumns.includes(column)) {
              detectedSegmentColumns.push(column)
            }
          }
          
          // Pattern matching for more complex column names
          segmentPatterns.forEach(pattern => {
            if (pattern.test(column)) {
              if (!detectedSegmentColumns.includes(column)) {
                detectedSegmentColumns.push(column)
              }
            }
          })
        })
      }
    })

    console.log('Detected segment columns:', detectedSegmentColumns)

    // If no specific segment columns found, look for category-based segmentation
    if (detectedSegmentColumns.length === 0) {
      console.log('No specific segment columns found, looking for Category-based segmentation')
      
      // Try to use Category column to infer segments
      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.Country === selectedCountry && 
                selectedOEMs.includes(row.OEM) &&
                row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
                row.Feature && row.Feature.toString().trim() !== '') {
              
              const oem = row.OEM.toString().trim()
              const feature = row.Feature.toString().trim()
              const category = row.Category?.toString().trim() || 'Unspecified'
              
              // Use category as segment for now
              availableSegments.add(category)
              
              // Update OEM → Segment mapping
              if (!oemSegmentMap.has(oem)) {
                oemSegmentMap.set(oem, new Map())
              }
              const oemSegments = oemSegmentMap.get(oem)!
              oemSegments.set(category, (oemSegments.get(category) || 0) + 1)
              
              // Update Segment → OEM mapping
              if (!segmentOemMap.has(category)) {
                segmentOemMap.set(category, new Map())
              }
              const segmentOEMs = segmentOemMap.get(category)!
              segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
              
              console.log(`Feature ${feature} categorized as ${category} for ${oem}`)
            }
          })
        }
      })
    } else {
      // Process with detected segment columns
      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.Country === selectedCountry && 
                selectedOEMs.includes(row.OEM) &&
                row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
                row.Feature && row.Feature.toString().trim() !== '') {
              
              const oem = row.OEM.toString().trim()
              const feature = row.Feature.toString().trim()
              
              console.log('Processing feature:', feature, 'for OEM:', oem)
              
              // Check each detected segment column
              detectedSegmentColumns.forEach(segmentColumn => {
                const segmentValue = row[segmentColumn]?.toString().trim().toLowerCase()
                console.log(`Checking ${segmentColumn} for ${feature}: value = "${segmentValue}"`)
                
                if (segmentValue === 'yes' || segmentValue === 'y' || segmentValue === '1' || 
                    segmentValue === 'true' || segmentValue === 'available') {
                  
                  // Map column name to standard segment name
                  const columnLower = segmentColumn.toLowerCase().trim()
                  let standardSegment = segmentColumn // Default to original name
                  
                  if (columnLower.includes('entry') || columnLower === 'e' || columnLower.includes('basic')) {
                    standardSegment = 'Entry'
                  } else if (columnLower.includes('mid') || columnLower === 'm' || columnLower.includes('standard')) {
                    standardSegment = 'Mid'
                  } else if (columnLower.includes('premium') || columnLower === 'p') {
                    standardSegment = 'Premium'
                  } else if (columnLower.includes('luxury') || columnLower === 'l' || columnLower.includes('executive')) {
                    standardSegment = 'Luxury'
                  }
                  
                  availableSegments.add(standardSegment)
                  
                  // Update OEM → Segment mapping
                  if (!oemSegmentMap.has(oem)) {
                    oemSegmentMap.set(oem, new Map())
                  }
                  const oemSegments = oemSegmentMap.get(oem)!
                  oemSegments.set(standardSegment, (oemSegments.get(standardSegment) || 0) + 1)
                  
                  // Update Segment → OEM mapping
                  if (!segmentOemMap.has(standardSegment)) {
                    segmentOemMap.set(standardSegment, new Map())
                  }
                  const segmentOEMs = segmentOemMap.get(standardSegment)!
                  segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
                  
                  console.log(`Feature ${feature} applies to ${standardSegment} segment for ${oem}`)
                }
              })
            }
          })
        }
      })
    }

    const segments = Array.from(availableSegments).sort()
    console.log('Available segments:', segments)
    console.log('OEM Segment Map:', Array.from(oemSegmentMap.entries()))
    console.log('Segment OEM Map:', Array.from(segmentOemMap.entries()))

    // Build "Features by OEM and Vehicle Segment" chart data
    const oemChartData = selectedOEMs.map(oem => {
      const oemItem: any = { oem }
      const oemSegments = oemSegmentMap.get(oem) || new Map()
      
      segments.forEach(segment => {
        oemItem[segment] = oemSegments.get(segment) || 0
      })
      
      // Calculate total for this OEM
      const total = segments.reduce((sum, segment) => sum + (oemItem[segment] || 0), 0)
      console.log(`OEM ${oem} total features across segments:`, total, oemItem)
      
      return oemItem
    }).filter(item => {
      // Only include OEMs that have at least one feature in any segment
      const hasFeatures = segments.some(segment => item[segment] > 0)
      console.log(`OEM ${item.oem} has features:`, hasFeatures)
      return hasFeatures
    })

    // Build "Features by Vehicle Segment and OEM" chart data
    const segmentChartData = segments.map(segment => {
      const segmentItem: any = { segment }
      const segmentOEMs = segmentOemMap.get(segment) || new Map()
      
      selectedOEMs.forEach(oem => {
        segmentItem[oem] = segmentOEMs.get(oem) || 0
      })
      
      // Calculate total for this segment
      const total = selectedOEMs.reduce((sum, oem) => sum + (segmentItem[oem] || 0), 0)
      console.log(`Segment ${segment} total features across OEMs:`, total, segmentItem)
      
      return segmentItem
    }).filter(item => {
      // Only include segments that have at least one feature from any OEM
      const hasFeatures = selectedOEMs.some(oem => item[oem] > 0)
      console.log(`Segment ${item.segment} has features:`, hasFeatures)
      return hasFeatures
    })

    console.log('Final OEM Chart Data:', oemChartData)
    console.log('Final Segment Chart Data:', segmentChartData)
    
    return { 
      oemChartData, 
      segmentChartData, 
      availableSegments: segments 
    }
  }

  const { oemChartData, segmentChartData, availableSegments } = useMemo(() => {
    return processVehicleSegmentData()
  }, [waypointData, selectedCountry, selectedOEMs])

  // Colors for vehicle segments
  const segmentColors = {
    'Entry': '#ef4444',
    'Mid': '#f97316', 
    'Premium': '#eab308',
    'Luxury': '#10b981'
  }

  // Colors for OEMs
  const oemColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

  const handleOEMBarClick = (data: any) => {
    setSelectedOEM(data.oem === selectedOEM ? null : data.oem)
    setSelectedSegment(null)
  }

  const handleSegmentBarClick = (data: any) => {
    setSelectedSegment(data.segment === selectedSegment ? null : data.segment)
    setSelectedOEM(null)
  }

  console.log('Final render check:', { 
    oemChartDataLength: oemChartData.length, 
    segmentChartDataLength: segmentChartData.length,
    availableSegments,
    selectedCountry,
    selectedOEMs 
  })

  if (!oemChartData.length && !segmentChartData.length) {
    return (
      <div className={`h-full flex items-center justify-center ${theme.textMuted}`}>
        <div className="text-center">
          <p>No vehicle segment data available for the selected filters</p>
          <p className="text-sm mt-2">Selected Country: {selectedCountry}</p>
          <p className="text-sm">Selected OEMs: {selectedOEMs.join(', ')}</p>
          <p className="text-sm mt-2">Available segments detected: {availableSegments.join(', ') || 'None'}</p>
          <p className="text-sm mt-1 text-orange-400">
            Tip: Check console logs to see what columns are available in your CSV data
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Features by OEM and Vehicle Segment */}
      {oemChartData.length > 0 && (
        <div className="space-y-4">
          <div>
            <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
              Features by OEM and Vehicle Segment
            </h4>
            <p className={`${theme.textMuted} text-sm`}>
              Number of features for each OEM, broken down by vehicle segments
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={oemChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              style={{ backgroundColor: 'transparent' }}
              onClick={handleOEMBarClick}
            >
              <XAxis 
                dataKey="oem" 
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any, name: string) => [
                  `${value} features`,
                  `${name} Segment`
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              {availableSegments.map((segment, index) => (
                <Bar
                  key={segment}
                  dataKey={segment}
                  stackId="a"
                  fill={segmentColors[segment as keyof typeof segmentColors] || oemColors[index % oemColors.length]}
                  name={segment}
                  style={{ backgroundColor: 'transparent' }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Features by Vehicle Segment and OEM */}
      {segmentChartData.length > 0 && (
        <div className="space-y-4">
          <div>
            <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
              Features by Vehicle Segment and OEM
            </h4>
            <p className={`${theme.textMuted} text-sm`}>
              Number of features for each vehicle segment, broken down by OEM manufacturers
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={segmentChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              style={{ backgroundColor: 'transparent' }}
              onClick={handleSegmentBarClick}
            >
              <XAxis 
                dataKey="segment" 
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any, name: string) => [
                  `${value} features`,
                  name
                ]}
                labelFormatter={(label) => `${label} Segment`}
              />
              <Legend />
              {selectedOEMs.map((oem, index) => (
                <Bar
                  key={oem}
                  dataKey={oem}
                  stackId="a"
                  fill={oemColors[index % oemColors.length]}
                  name={oem}
                  style={{ backgroundColor: 'transparent' }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default VehicleSegmentChart
