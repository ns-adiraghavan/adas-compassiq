
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"

interface OEMBarChartProps {
  selectedCountry: string
  onOEMClick: (oem: string) => void
}

const OEMBarChart = ({ selectedCountry, onOEMClick }: OEMBarChartProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry) return []

    console.log('Processing OEM feature counts for country:', selectedCountry)
    
    const oemFeatureCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      console.log('Processing file:', file.file_name)
      
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          // Log a sample row to understand the structure
          if (oemFeatureCounts.size === 0) {
            console.log('Sample row structure:', row)
            console.log('Available keys in row:', Object.keys(row))
          }

          const oem = row.OEM || row.oem || row['OEM '] || row[' OEM']
          const country = row.Country || row.country || row['Country '] || row[' Country']

          // Only process rows with valid OEM and Country data
          if (oem && typeof oem === 'string' && 
              country && typeof country === 'string' &&
              !oem.toLowerCase().includes('merged') &&
              !oem.toLowerCase().includes('monitoring') &&
              oem.trim() !== '') {
            
            // Filter by selected country - exact match
            if (country.toString().trim() === selectedCountry) {
              // Count every feature entry for this OEM in this country
              const oemName = oem.toString().trim()
              oemFeatureCounts.set(oemName, (oemFeatureCounts.get(oemName) || 0) + 1)
            }
          }
        })
      }
    })

    console.log('OEM Feature Counts for', selectedCountry, ':', Array.from(oemFeatureCounts.entries()))

    return Array.from(oemFeatureCounts.entries())
      .map(([oem, count]) => ({ oem, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15) // Top 15 OEMs
  }, [waypointData, selectedCountry])

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-400">Loading OEM data...</div>
      </div>
    )
  }

  if (!selectedCountry) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-400">Please select a country to view OEM data</div>
      </div>
    )
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="oem" 
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value, name) => [value, 'Feature Count']}
          />
          <Bar 
            dataKey="count" 
            fill="#3B82F6"
            cursor="pointer"
            onClick={(data) => data && onOEMClick(data.oem)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OEMBarChart
