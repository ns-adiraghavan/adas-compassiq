
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

  if (chartData.length === 0) {
    return (
      <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl animate-fade-in">
        <CardHeader className="pb-4">
          <CardTitle className="text-white/90 text-lg font-medium tracking-tight">
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] flex items-center justify-center">
          <div className="text-center animate-pulse-slow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/20"></div>
            </div>
            <p className="text-white/60 font-medium text-sm">No category data available</p>
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
          <div className="w-2 h-2 rounded-full bg-green-400 mr-3 animate-pulse"></div>
          Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} className="animate-scale-in">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="category" 
              stroke="rgba(255,255,255,0.7)"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
              fontWeight="500"
            />
            <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} fontWeight="500" />
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
              formatter={(value: number) => [`${value} features`, 'Count']}
              labelStyle={{
                color: '#374151',
                fontWeight: '600',
                marginBottom: '4px'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#10B981" 
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
