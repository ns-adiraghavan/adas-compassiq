
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { useMemo } from "react"

interface FeatureLandscapeProps {
  selectedOEM: string
  selectedCountry: string
  filteredData: any[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const FeatureLandscape = ({ selectedOEM, selectedCountry, filteredData }: FeatureLandscapeProps) => {
  const { categoryData, segmentData, lighthouseFeatures } = useMemo(() => {
    if (!filteredData.length) {
      return { categoryData: [], segmentData: [], lighthouseFeatures: [] }
    }

    // Category breakdown
    const categoryCounts = new Map<string, number>()
    const segmentCounts = new Map<string, number>()
    const lighthouseFeatures: string[] = []

    filteredData.forEach(row => {
      // Categories
      if (row.Category) {
        const current = categoryCounts.get(row.Category) || 0
        categoryCounts.set(row.Category, current + 1)
      }

      // Segments
      if (row["Entry Segment"] && row["Entry Segment"].toLowerCase() !== 'no') {
        segmentCounts.set("Entry", (segmentCounts.get("Entry") || 0) + 1)
      }
      if (row["Mid Segment"] && row["Mid Segment"].toLowerCase() !== 'no') {
        segmentCounts.set("Mid", (segmentCounts.get("Mid") || 0) + 1)
      }
      if (row["Premium Segment"] && row["Premium Segment"].toLowerCase() !== 'no') {
        segmentCounts.set("Premium", (segmentCounts.get("Premium") || 0) + 1)
      }
      if (row["Luxury Segment"] && row["Luxury Segment"].toLowerCase() !== 'no') {
        segmentCounts.set("Luxury", (segmentCounts.get("Luxury") || 0) + 1)
      }

      // Lighthouse features
      if (row["Lighthouse Feature"] && row["Lighthouse Feature"].toLowerCase() === 'yes' && row.Feature) {
        lighthouseFeatures.push(row.Feature)
      }
    })

    return {
      categoryData: Array.from(categoryCounts.entries()).map(([category, count]) => ({
        category,
        count
      })),
      segmentData: Array.from(segmentCounts.entries()).map(([segment, count]) => ({
        segment,
        count
      })),
      lighthouseFeatures: lighthouseFeatures.slice(0, 6) // Top 6 lighthouse features
    }
  }, [filteredData])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Feature Categories */}
      <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Feature Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/60">
              No category data available
            </div>
          )}
          {categoryData.length > 0 && (
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white/80 text-sm">{item.category}</span>
                  </div>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Segment Coverage */}
      <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Segment Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          {segmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={segmentData}>
                <XAxis 
                  dataKey="segment" 
                  tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(75, 85, 99, 0.5)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(75, 85, 99, 0.5)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/60">
              No segment data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lighthouse Features */}
      {lighthouseFeatures.length > 0 && (
        <Card className="lg:col-span-2 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-yellow-200 flex items-center">
              ⭐ Lighthouse Features
              <span className="ml-2 text-sm font-normal text-yellow-300/70">
                Key differentiating capabilities
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lighthouseFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3"
                >
                  <div className="text-yellow-200 font-medium text-sm">{feature}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FeatureLandscape
