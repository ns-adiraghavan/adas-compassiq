
import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface VehicleSegmentChartProps {
  selectedCountry: string
  selectedOEMs: string[]
}

const VehicleSegmentChart = ({ selectedCountry, selectedOEMs }: VehicleSegmentChartProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const { chartData, tableData, categories } = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { chartData: [], tableData: [], categories: [] }
    }

    console.log('Processing chart data for:', { selectedCountry, selectedOEMs })

    // Define standard vehicle segments
    const vehicleSegments = ['Entry', 'Mid', 'Luxury', 'Premium']
    
    // Collect all unique categories
    const uniqueCategories = new Set<string>()
    const segmentCategoryData = new Map<string, Map<string, { features: string[], oemCounts: Map<string, number> }>>()
    
    // Initialize data structure
    vehicleSegments.forEach(segment => {
      segmentCategoryData.set(segment, new Map())
    })

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Category && row.Category.toString().trim() !== '' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const category = row.Category.toString().trim()
            const feature = row.Feature.toString().trim()
            const oem = row.OEM.toString().trim()
            
            // Map to standard segments or use a default
            let segment = 'Mid' // Default segment
            const possibleKeys = ['Vehicle Segment', 'Segment', 'segment', 'vehicle_segment', 'VehicleSegment']
            
            for (const key of possibleKeys) {
              if (row[key]) {
                const segmentValue = row[key].toString().trim()
                if (vehicleSegments.includes(segmentValue)) {
                  segment = segmentValue
                  break
                }
              }
            }

            uniqueCategories.add(category)
            
            const segmentData = segmentCategoryData.get(segment)!
            if (!segmentData.has(category)) {
              segmentData.set(category, { features: [], oemCounts: new Map() })
            }
            
            const categoryData = segmentData.get(category)!
            if (!categoryData.features.includes(feature)) {
              categoryData.features.push(feature)
            }
            
            if (!categoryData.oemCounts.has(oem)) {
              categoryData.oemCounts.set(oem, 0)
            }
            categoryData.oemCounts.set(oem, categoryData.oemCounts.get(oem)! + 1)
          }
        })
      }
    })

    const categoriesArray = Array.from(uniqueCategories).sort()
    
    // Build chart data
    const chartData = vehicleSegments.map(segment => {
      const segmentItem: any = { segment }
      
      categoriesArray.forEach(category => {
        const segmentData = segmentCategoryData.get(segment)
        const categoryData = segmentData?.get(category)
        
        if (categoryData) {
          // Sum up feature counts across all selected OEMs for this category
          segmentItem[category] = Array.from(categoryData.oemCounts.values()).reduce((sum, count) => sum + count, 0)
        } else {
          segmentItem[category] = 0
        }
      })
      
      return segmentItem
    })

    // Build table data
    const tableData = vehicleSegments.map(segment => {
      const segmentData = segmentCategoryData.get(segment)
      const segmentFeatures: any = { segment }
      
      categoriesArray.forEach(category => {
        const categoryData = segmentData?.get(category)
        segmentFeatures[category] = categoryData ? categoryData.features : []
      })
      
      return segmentFeatures
    })

    // Filter out segments with no data
    const filteredChartData = chartData.filter(item => 
      categoriesArray.some(category => item[category] > 0)
    )

    console.log('Final chart data:', filteredChartData)
    console.log('Table data:', tableData)
    
    return { 
      chartData: filteredChartData, 
      tableData, 
      categories: categoriesArray 
    }
  }, [waypointData, selectedCountry, selectedOEMs])

  const categoryColors = [
    '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', 
    '#06b6d4', '#ec4899', '#84cc16', '#6366f1',
    '#f97316', '#14b8a6', '#a855f7', '#eab308'
  ]

  const handleBarClick = (data: any) => {
    setSelectedSegment(data.segment === selectedSegment ? null : data.segment)
  }

  if (!chartData.length) {
    return (
      <div className={`h-full flex items-center justify-center ${theme.textMuted}`}>
        <p>No data available for the selected filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          style={{ backgroundColor: 'transparent' }}
          onClick={handleBarClick}
        >
          <XAxis 
            dataKey="segment" 
            tick={{ fill: theme.textSecondary.includes('text-gray-400') ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: theme.textSecondary.includes('text-gray-400') ? '#9ca3af' : '#6b7280' }}
            axisLine={{ stroke: theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.cardBackground.includes('bg-gray-800') ? '#1f2937' : '#ffffff',
              border: `1px solid ${theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: theme.textPrimary.includes('text-white') ? '#ffffff' : '#000000',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: any, name: string) => [
              `${value} features`,
              name
            ]}
            labelFormatter={(label) => `${label} Segment`}
          />
          <Legend />
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              stackId="a"
              fill={categoryColors[index % categoryColors.length]}
              name={category}
              style={{ backgroundColor: 'transparent' }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Feature Details Table */}
      {selectedSegment && (
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className="mb-4">
            <h4 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
              {selectedSegment} Segment - Features by Category
            </h4>
            <p className={`${theme.textMuted} text-sm`}>
              Click on a segment bar to view detailed features by category
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={`${theme.textPrimary} font-medium`}>Category</TableHead>
                  <TableHead className={`${theme.textPrimary} font-medium`}>Features</TableHead>
                  <TableHead className={`${theme.textPrimary} font-medium`}>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const segmentData = tableData.find(item => item.segment === selectedSegment)
                  const features = segmentData?.[category] || []
                  
                  if (features.length === 0) return null
                  
                  return (
                    <TableRow key={category}>
                      <TableCell className={`${theme.textPrimary} font-medium`}>
                        {category}
                      </TableCell>
                      <TableCell className={`${theme.textSecondary} max-w-md`}>
                        <div className="space-y-1">
                          {features.slice(0, 5).map((feature: string, index: number) => (
                            <div key={index} className="text-sm">
                              • {feature}
                            </div>
                          ))}
                          {features.length > 5 && (
                            <div className={`text-xs ${theme.textMuted}`}>
                              +{features.length - 5} more features
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`${theme.textPrimary} font-medium`}>
                        {features.length}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleSegmentChart
