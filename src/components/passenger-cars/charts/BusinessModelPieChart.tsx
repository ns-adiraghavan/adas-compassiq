
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
    if (!waypointData?.csvData?.length || !selectedOEM || !selectedCountry) return []

    console.log('Processing business model data for OEM:', selectedOEM, 'Country:', selectedCountry)
    
    const modelCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          // Step 1: Filter by selected country first
          const country = row.Country || row.country || row['Country '] || row[' Country']
          if (!country || country.toString().trim() !== selectedCountry) return

          // Step 2: Filter by availability = "Available"
          const featureAvailability = row['Feature Availability'] || 
                                    row['Available Feature'] || 
                                    row['Available_Feature'] || 
                                    row.available_feature || 
                                    row.AvailableFeature ||
                                    row['feature_availability'] ||
                                    row['FEATURE AVAILABILITY']

          if (!featureAvailability || 
              featureAvailability.toString().trim().toLowerCase() !== 'available') return

          // Step 3: Filter by selected OEM
          const oem = row.OEM || row.oem || row['OEM '] || row[' OEM']
          if (!oem || oem.toString().trim() !== selectedOEM) return

          // Step 4: Extract business model
          const businessModel = row['Business Model'] || 
                              row['business_model'] || 
                              row['BusinessModel'] || 
                              row['BUSINESS MODEL']

          if (businessModel && typeof businessModel === 'string' && businessModel.trim() !== '') {
            const model = businessModel.toString().trim()
            modelCounts.set(model, (modelCounts.get(model) || 0) + 1)
            console.log('Found business model:', model, 'Total count:', modelCounts.get(model))
          }
        })
      }
    })

    console.log('Final business model counts:', Array.from(modelCounts.entries()))

    return Array.from(modelCounts.entries())
      .map(([model, count]) => ({ name: model, value: count }))
      .sort((a, b) => b.value - a.value)
  }, [waypointData, selectedOEM, selectedCountry])

  if (chartData.length === 0) {
    return (
      <Card className="h-full bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Business Model</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <p>No business model data available</p>
            <p className="text-sm mt-1">for {selectedOEM} in {selectedCountry}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
