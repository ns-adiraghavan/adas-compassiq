
import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"

interface BusinessModelPieChartProps {
  selectedOEM: string
  selectedCountry: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

const BusinessModelPieChart = ({ selectedOEM, selectedCountry }: BusinessModelPieChartProps) => {
  const { data: waypointData } = useWaypointData()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const modelCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM === selectedOEM && 
              (!selectedCountry || row.Country === selectedCountry) &&
              row['Business Model'] && typeof row['Business Model'] === 'string') {
            
            const model = row['Business Model'].trim()
            modelCounts.set(model, (modelCounts.get(model) || 0) + 1)
          }
        })
      }
    })

    return Array.from(modelCounts.entries())
      .map(([model, count]) => ({ name: model, value: count }))
      .sort((a, b) => b.value - a.value)
  }, [waypointData, selectedOEM, selectedCountry])

  return (
    <Card className="h-full bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Business Model</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#F9FAFB', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default BusinessModelPieChart
