
import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface VehicleSegmentChartProps {
  selectedCountry: string
  selectedOEMs: string[]
}

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const { oemChartData, segmentChartData, tableData, availableSegments } = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { oemChartData: [], segmentChartData: [], tableData: [], availableSegments: [] }
    }

    console.log('Processing chart data for:', { selectedCountry, selectedOEMs })

    // Collect segment data from CSV
    const segmentData = new Map<string, Map<string, number>>() // OEM -> Segment -> Count
    const oemData = new Map<string, Map<string, number>>() // Segment -> OEM -> Count
    const uniqueSegments = new Set<string>()
    const detailedData = new Map<string, Map<string, string[]>>() // key -> category -> features

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const oem = row.OEM.toString().trim()
            const feature = row.Feature.toString().trim()
            
            // Find segment columns dynamically
            const segmentColumns = ['Entry', 'Mid', 'Luxury', 'Premium']
            let foundSegment = null
            
            for (const segmentCol of segmentColumns) {
              if (row[segmentCol] && row[segmentCol].toString().trim().toLowerCase() === 'yes') {
                foundSegment = segmentCol.toLowerCase()
                uniqueSegments.add(foundSegment)
                break
              }
            }
            
            if (foundSegment) {
              // For OEM chart data (OEM on x-axis, segments stacked)
              if (!segmentData.has(oem)) {
                segmentData.set(oem, new Map())
              }
              const oemSegments = segmentData.get(oem)!
              oemSegments.set(foundSegment, (oemSegments.get(foundSegment) || 0) + 1)
              
              // For Segment chart data (Segment on x-axis, OEMs stacked)
              if (!oemData.has(foundSegment)) {
                oemData.set(foundSegment, new Map())
              }
              const segmentOEMs = oemData.get(foundSegment)!
              segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
            }
          }
        })
      }
    })

    const segments = Array.from(uniqueSegments).sort()
    console.log('Found segments:', segments)

    // Build OEM chart data (Features by OEM and Vehicle Segment)
    const oemChartData = selectedOEMs.map(oem => {
      const oemItem: any = { oem }
      const oemSegments = segmentData.get(oem) || new Map()
      
      segments.forEach(segment => {
        oemItem[segment] = oemSegments.get(segment) || 0
      })
      
      return oemItem
    }).filter(item => segments.some(segment => item[segment] > 0))

    // Build Segment chart data (Features by Vehicle Segment and OEM)
    const segmentChartData = segments.map(segment => {
      const segmentItem: any = { segment }
      const segmentOEMs = oemData.get(segment) || new Map()
      
      selectedOEMs.forEach(oem => {
        segmentItem[oem] = segmentOEMs.get(oem) || 0
      })
      
      return segmentItem
    }).filter(item => selectedOEMs.some(oem => item[oem] > 0))

    console.log('OEM Chart Data:', oemChartData)
    console.log('Segment Chart Data:', segmentChartData)
    
    return { 
      oemChartData, 
      segmentChartData, 
      tableData: [], 
      availableSegments: segments 
    }
  }, [waypointData, selectedCountry, selectedOEMs])

  const segmentColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']
  const oemColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

  const handleOEMBarClick = (data: any) => {
    setSelectedOEM(data.oem === selectedOEM ? null : data.oem)
    setSelectedSegment(null)
  }

  const handleSegmentBarClick = (data: any) => {
    setSelectedSegment(data.segment === selectedSegment ? null : data.segment)
    setSelectedOEM(null)
  }

  if (!oemChartData.length && !segmentChartData.length) {
    return (
      <div className={`h-full flex items-center justify-center ${theme.textMuted}`}>
        <p>No data available for the selected filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Features by OEM and Vehicle Segment */}
      <div className="space-y-4">
        <div>
          <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
            Features by OEM and Vehicle Segment
          </h4>
          <p className={`${theme.textMuted} text-sm`}>
            Distribution of available features across vehicle segments for each OEM
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
                name
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            {availableSegments.map((segment, index) => (
              <Bar
                key={segment}
                dataKey={segment}
                stackId="a"
                fill={segmentColors[index % segmentColors.length]}
                name={segment}
                style={{ backgroundColor: 'transparent' }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Features by Vehicle Segment and OEM */}
      <div className="space-y-4">
        <div>
          <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
            Features by Vehicle Segment and OEM
          </h4>
          <p className={`${theme.textMuted} text-sm`}>
            Distribution of available features across OEMs for each vehicle segment
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
    </div>
  )
}

export default VehicleSegmentChart
