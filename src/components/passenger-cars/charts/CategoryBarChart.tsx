
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"

interface CategoryBarChartProps {
  selectedOEM: string
  selectedCountry: string
}

const CategoryBarChart = ({ selectedOEM, selectedCountry }: CategoryBarChartProps) => {
  const { data: waypointData } = useWaypointData()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const categoryCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM === selectedOEM && 
              (!selectedCountry || row.Country === selectedCountry) &&
              row.Category && typeof row.Category === 'string') {
            
            const category = row.Category.trim()
            categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
          }
        })
      }
    })

    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }, [waypointData, selectedOEM, selectedCountry])

  return (
    <Card className="h-full bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="category" 
              stroke="#9CA3AF"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CategoryBarChart
