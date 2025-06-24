
import { useMemo } from "react"
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

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return []
    }

    console.log('Processing chart data for:', { selectedCountry, selectedOEMs })

    // First, let's discover what vehicle segment values exist in the data
    const uniqueSegments = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available') {
            
            // Check all possible keys that might contain segment data
            const possibleKeys = ['Vehicle Segment', 'Segment', 'segment', 'vehicle_segment', 'VehicleSegment']
            
            for (const key of possibleKeys) {
              if (row[key] && row[key].toString().trim() !== '') {
                uniqueSegments.add(row[key].toString().trim())
              }
            }
          }
        })
      }
    })

    console.log('Unique segments found in data:', Array.from(uniqueSegments))

    // If no segments found, let's use a fallback approach - group by feature categories
    if (uniqueSegments.size === 0) {
      console.log('No vehicle segments found, using feature categories instead')
      
      const categoryData = new Map<string, any>()
      
      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.Country === selectedCountry && 
                selectedOEMs.includes(row.OEM) &&
                row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
                row.Category && row.Category.toString().trim() !== '') {
              
              const category = row.Category.toString().trim()
              
              if (!categoryData.has(category)) {
                const categoryItem: any = { segment: category }
                selectedOEMs.forEach(oem => {
                  categoryItem[oem] = 0
                })
                categoryData.set(category, categoryItem)
              }
              
              const categoryItem = categoryData.get(category)
              if (categoryItem[row.OEM] !== undefined) {
                categoryItem[row.OEM]++
              }
            }
          })
        }
      })

      const result = Array.from(categoryData.values())
      console.log('Category-based chart data:', result)
      return result
    }

    // Use the actual segments found in the data
    const segments = Array.from(uniqueSegments).sort()
    
    const segmentData = segments.map(segment => {
      const segmentItem: any = { segment }
      
      selectedOEMs.forEach((oem) => {
        let featureCount = 0
        
        waypointData.csvData.forEach(file => {
          if (file.data && Array.isArray(file.data)) {
            file.data.forEach((row: any) => {
              // Check all possible segment keys
              const possibleKeys = ['Vehicle Segment', 'Segment', 'segment', 'vehicle_segment', 'VehicleSegment']
              let segmentValue = ''
              
              for (const key of possibleKeys) {
                if (row[key]) {
                  segmentValue = row[key].toString().trim()
                  break
                }
              }
              
              if (row.Country === selectedCountry &&
                  row.OEM === oem &&
                  segmentValue === segment &&
                  row['Feature Availability']?.toString().trim().toLowerCase() === 'available') {
                featureCount++
              }
            })
          }
        })
        
        segmentItem[oem] = featureCount
      })
      
      console.log(`Segment ${segment} data:`, segmentItem)
      return segmentItem
    })

    // Filter out segments with no data
    const filteredData = segmentData.filter(item => 
      selectedOEMs.some(oem => item[oem] > 0)
    )

    console.log('Final chart data:', filteredData)
    return filteredData
  }, [waypointData, selectedCountry, selectedOEMs])

  const oemColors = [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
    '#ef4444', '#ec4899', '#84cc16', '#6366f1'
  ]

  if (!chartData.length) {
    return (
      <div className={`h-full flex items-center justify-center ${theme.textMuted}`}>
        <p>No data available for the selected filters</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
        />
        <Legend />
        {selectedOEMs.map((oem, index) => (
          <Bar
            key={oem}
            dataKey={oem}
            stackId="a"
            fill={oemColors[index % oemColors.length]}
            name={oem}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default VehicleSegmentChart
