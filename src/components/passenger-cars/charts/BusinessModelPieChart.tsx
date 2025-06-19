import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"

interface BusinessModelPieChartProps {
  selectedOEM: string
  selectedCountry: string
}

// Apple-inspired color palette with better contrast and accessibility
const COLORS = [
  '#007AFF', // Blue
  '#34C759', // Green  
  '#FF9500', // Orange
  '#FF3B30', // Red
  '#AF52DE', // Purple
  '#00C7BE', // Teal
  '#FFD60A', // Yellow
  '#FF6482'  // Pink
]

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

          // Step 4: Extract business model type and exclude "Not Available"
          const businessModelType = row['Business Model Type'] || 
                                  row['business_model_type'] || 
                                  row['BusinessModelType'] || 
                                  row['BUSINESS MODEL TYPE'] ||
                                  row['Business_Model_Type']

          if (businessModelType && 
              typeof businessModelType === 'string' && 
              businessModelType.trim() !== '' &&
              businessModelType.toString().trim().toLowerCase() !== 'not available') {
            
            const modelType = businessModelType.toString().trim()
            modelCounts.set(modelType, (modelCounts.get(modelType) || 0) + 1)
            console.log('Found business model type:', modelType, 'Total count:', modelCounts.get(modelType))
          }
        })
      }
    })

    console.log('Final business model type counts:', Array.from(modelCounts.entries()))

    return Array.from(modelCounts.entries())
      .map(([model, count]) => ({ name: model, value: count }))
      .sort((a, b) => b.value - a.value)
  }, [waypointData, selectedOEM, selectedCountry])

  if (chartData.length === 0) {
    return (
      <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl animate-fade-in">
        <CardHeader className="pb-4">
          <CardTitle className="text-white/90 text-lg font-medium tracking-tight">
            Business Model
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] flex items-center justify-center">
          <div className="text-center animate-pulse-slow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/20"></div>
            </div>
            <p className="text-white/60 font-medium text-sm">No business model data available</p>
            <p className="text-white/40 text-xs mt-1">for {selectedOEM} in {selectedCountry}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl hover-lift animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-white/90 text-lg font-medium tracking-tight flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 mr-3 animate-pulse"></div>
          Business Model
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="animate-scale-in">
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                color: '#1f2937',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px'
              }}
              formatter={(value: number, name: string) => [
                `${value} features`,
                name
              ]}
              labelStyle={{
                color: '#374151',
                fontWeight: '600',
                marginBottom: '4px'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                color: '#F9FAFB', 
                fontSize: '12px',
                fontWeight: '500',
                paddingTop: '16px'
              }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-white/80 hover:text-white transition-colors duration-200">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default BusinessModelPieChart
