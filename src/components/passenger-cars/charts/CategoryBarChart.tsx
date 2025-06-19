
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"

interface CategoryBarChartProps {
  selectedOEM: string
  selectedCountry: string
}

const CategoryBarChart = ({ selectedOEM, selectedCountry }: CategoryBarChartProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM || !selectedCountry) return []

    console.log('Processing category distribution for OEM:', selectedOEM, 'Country:', selectedCountry)
    
    const categoryCounts = new Map<string, number>()

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

          // Step 4: Extract category data
          const category = row.Category || row.category || row['Category '] || row[' Category']
          if (category && typeof category === 'string' && category.trim() !== '') {
            const categoryName = category.toString().trim()
            categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1)
            console.log('Found category for chart:', categoryName, 'Total count:', categoryCounts.get(categoryName))
          }
        })
      }
    })

    console.log('Final category chart counts:', Array.from(categoryCounts.entries()))

    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }, [waypointData, selectedOEM, selectedCountry])

  // Extract color values from theme classes for recharts
  const getPrimaryColor = () => {
    if (theme.primary.includes('blue')) return '#3B82F6'
    if (theme.primary.includes('emerald')) return '#10B981'
    if (theme.primary.includes('orange')) return '#F97316'
    if (theme.primary.includes('purple')) return '#8B5CF6'
    if (theme.primary.includes('slate')) return '#64748B'
    return '#10B981' // default emerald
  }

  const getGridColor = () => {
    return theme.name === 'Arctic White' ? '#E2E8F0' : 'rgba(255,255,255,0.1)'
  }

  const getTextColor = () => {
    return theme.name === 'Arctic White' ? '#475569' : 'rgba(255,255,255,0.7)'
  }

  const getTooltipBg = () => {
    return theme.name === 'Arctic White' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)'
  }

  const getTooltipBorder = () => {
    return theme.name === 'Arctic White' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(255, 255, 255, 0.2)'
  }

  const getTooltipTextColor = () => {
    return theme.name === 'Arctic White' ? '#1f2937' : '#F9FAFB'
  }

  if (chartData.length === 0) {
    return (
      <Card className={`h-full ${theme.cardBackground} backdrop-blur-sm ${theme.cardBorder} border shadow-xl animate-fade-in`}>
        <CardHeader className="pb-4">
          <CardTitle className={`${theme.textSecondary} text-lg font-medium tracking-tight`}>
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] flex items-center justify-center">
          <div className="text-center animate-pulse-slow">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.cardBackground} flex items-center justify-center`}>
              <div className={`w-6 h-6 rounded-full ${theme.accent}`}></div>
            </div>
            <p className={`${theme.textMuted} font-medium text-sm`}>No category data available</p>
            <p className={`${theme.textMuted} text-xs mt-1 opacity-60`}>for {selectedOEM} in {selectedCountry}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`h-full ${theme.cardBackground} backdrop-blur-sm ${theme.cardBorder} border shadow-xl hover-lift animate-fade-in`}>
      <CardHeader className="pb-4">
        <CardTitle className={`${theme.textSecondary} text-lg font-medium tracking-tight flex items-center`}>
          <div className={`w-2 h-2 rounded-full ${theme.secondary} mr-3 animate-pulse`}></div>
          Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} className="animate-scale-in">
            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
            <XAxis 
              dataKey="category" 
              stroke={getTextColor()}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
              fontWeight="500"
            />
            <YAxis stroke={getTextColor()} fontSize={12} fontWeight="500" />
            <Tooltip
              contentStyle={{
                backgroundColor: getTooltipBg(),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${getTooltipBorder()}`,
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                color: getTooltipTextColor(),
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px'
              }}
              formatter={(value: number) => [`${value} features`, 'Count']}
              labelStyle={{
                color: getTooltipTextColor(),
                fontWeight: '600',
                marginBottom: '4px'
              }}
              cursor={false}
            />
            <Bar 
              dataKey="count" 
              fill={getPrimaryColor()}
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity duration-200"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CategoryBarChart
