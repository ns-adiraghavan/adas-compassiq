
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

    // Define the vehicle segments we're looking for
    const vehicleSegments = ['Entry', 'Mid', 'Premium', 'Luxury']

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        // First, let's check what columns are available in the first row
        if (file.data.length > 0) {
          const firstRow = file.data[0]
          console.log('Available columns in CSV:', Object.keys(firstRow))
        }

        file.data.forEach((row: any) => {
          // Data Filtering: Filter by selected country and availability status
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const oem = row.OEM.toString().trim()
            const feature = row.Feature.toString().trim()
            
            console.log('Processing feature:', feature, 'for OEM:', oem)
            console.log('Row data for segments:', { Entry: row.Entry, Mid: row.Mid, Premium: row.Premium, Luxury: row.Luxury })

            // Feature Counting: Check which segments apply for this feature
            vehicleSegments.forEach(segment => {
              // Check if this segment column exists and has 'yes' value
              const segmentValue = row[segment]?.toString().trim().toLowerCase()
              console.log(`Checking ${segment} for ${feature}: value = "${segmentValue}"`)
              
              if (segmentValue === 'yes' || segmentValue === 'y' || segmentValue === '1') {
                availableSegments.add(segment)
                
                // Update OEM → Segment mapping
                if (!oemSegmentMap.has(oem)) {
                  oemSegmentMap.set(oem, new Map())
                }
                const oemSegments = oemSegmentMap.get(oem)!
                oemSegments.set(segment, (oemSegments.get(segment) || 0) + 1)
                
                // Update Segment → OEM mapping
                if (!segmentOemMap.has(segment)) {
                  segmentOemMap.set(segment, new Map())
                }
                const segmentOEMs = segmentOemMap.get(segment)!
                segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
                
                console.log(`Feature ${feature} applies to ${segment} segment for ${oem}`)
              }
            })
          }
        })
      }
    })

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
              Number of features for each OEM, broken down by vehicle segments (Entry, Mid, Premium, Luxury)
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
              {availableSegments.map((segment) => (
                <Bar
                  key={segment}
                  dataKey={segment}
                  stackId="a"
                  fill={segmentColors[segment as keyof typeof segmentColors] || '#6b7280'}
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
