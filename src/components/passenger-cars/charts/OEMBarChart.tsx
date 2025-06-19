
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
    if (!waypointData?.csvData?.length) return []

    const oemFeatureCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM && typeof row.OEM === 'string' && 
              !row.OEM.toLowerCase().includes('merged') &&
              !row.OEM.toLowerCase().includes('monitoring')) {
            
            // Filter by country if selected
            if (selectedCountry && row.Country !== selectedCountry) {
              return
            }

            // Only count if there's an actual feature available
            if (row.Feature && typeof row.Feature === 'string' && 
                row.Feature.trim() !== '' && 
                row.Feature.toLowerCase() !== 'n/a' &&
                row.Feature.toLowerCase() !== 'na') {
              
              const oem = row.OEM.trim()
              oemFeatureCounts.set(oem, (oemFeatureCounts.get(oem) || 0) + 1)
            }
          }
        })
      }
    })

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
            formatter={(value, name) => [value, 'Available Features']}
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
