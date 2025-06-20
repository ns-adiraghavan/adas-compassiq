
import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"

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
  const { theme } = useTheme()

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
      <Card className={`w-full h-full ${theme.cardBackground} backdrop-blur-sm ${theme.cardBorder} border shadow-xl animate-fade-in`}>
        <CardHeader className="pb-2">
          <CardTitle className={`${theme.textSecondary} text-sm font-medium tracking-tight`}>
            Business Model
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center animate-pulse-slow">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${theme.cardBackground} flex items-center justify-center`}>
              <div className={`w-3 h-3 rounded-full ${theme.accent}`}></div>
            </div>
            <p className={`${theme.textMuted} font-medium text-xs`}>No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full h-full ${theme.cardBackground} backdrop-blur-sm ${theme.cardBorder} border shadow-xl hover-lift animate-fade-in`}>
      <CardHeader className="pb-2">
        <CardTitle className={`${theme.textSecondary} text-sm font-medium tracking-tight flex items-center`}>
          <div className={`w-1.5 h-1.5 rounded-full ${theme.secondary} mr-2 animate-pulse`}></div>
          Business Model
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="animate-scale-in">
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={30}
              outerRadius={60}
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
                fontWeight: '500',
                padding: '8px 12px'
              }}
              formatter={(value: number, name: string) => [
                `${value} features`,
                name
              ]}
            />
            <Legend 
              wrapperStyle={{ 
                color: theme.name === 'Arctic White' ? '#374151' : '#F9FAFB', 
                fontSize: '10px',
                fontWeight: '500',
                paddingTop: '8px'
              }}
              iconType="circle"
              formatter={(value) => (
                <span className={`${theme.textMuted} hover:${theme.textPrimary} transition-colors duration-200 text-xs`}>
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
