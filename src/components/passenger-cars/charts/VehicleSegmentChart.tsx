
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

    // Define vehicle segments
    const segments = ['entry', 'mid', 'premium', 'luxury']
    
    // OEM colors for consistent visualization
    const oemColors = [
      '#ef4444', // red-500
      '#f97316', // orange-500
      '#eab308', // yellow-500
      '#22c55e', // green-500
      '#3b82f6', // blue-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#06b6d4', // cyan-500
    ]

    const segmentData = segments.map(segment => {
      const segmentItem: any = { segment }
      
      selectedOEMs.forEach((oem, index) => {
        let featureCount = 0
        
        waypointData.csvData.forEach(file => {
          if (file.data && Array.isArray(file.data)) {
            file.data.forEach((row: any) => {
              if (row.Country === selectedCountry &&
                  row.OEM === oem &&
                  row['Vehicle Segment']?.toLowerCase() === segment &&
                  row['Feature Availability']?.toString().trim().toLowerCase() === 'available') {
                featureCount++
              }
            })
          }
        })
        
        segmentItem[oem] = featureCount
      })
      
      return segmentItem
    })

    return segmentData.filter(item => 
      selectedOEMs.some(oem => item[oem] > 0)
    )
  }, [waypointData, selectedCountry, selectedOEMs])

  const oemColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
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
            color: theme.textPrimary.includes('text-white') ? '#ffffff' : '#000000'
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
