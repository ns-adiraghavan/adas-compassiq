
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

    // First, let's examine the actual structure of the data to find segment-related columns
    let sampleRow = null
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data) && file.data.length > 0 && !sampleRow) {
        sampleRow = file.data[0]
      }
    })

    if (sampleRow) {
      console.log('Sample row keys:', Object.keys(sampleRow))
      console.log('Sample row:', sampleRow)
    }

    // Collect all unique categories and segments from the actual data
    const uniqueCategories = new Set<string>()
    const segmentData = new Map<string, Map<string, { features: string[], oemCounts: Map<string, number> }>>()
    
    // Look for segment-related columns in the data
    const segmentColumns = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Category && row.Category.toString().trim() !== '' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const category = row.Category.toString().trim()
            uniqueCategories.add(category)
            
            // Look for all columns that might contain segment information
            // Check each column for segment-like values
            Object.keys(row).forEach(key => {
              const value = row[key]
              if (value && typeof value === 'string') {
                const trimmedValue = value.trim()
                // Check if this looks like a segment value
                if (['Entry', 'Mid', 'Luxury', 'Premium', 'Basic', 'Standard', 'High-end', 'Executive', 'Economy', 'Compact'].includes(trimmedValue)) {
                  segmentColumns.add(key)
                  console.log(`Found segment column: ${key} with value: ${trimmedValue}`)
                }
              }
            })
          }
        })
      }
    })

    console.log('Found segment columns:', Array.from(segmentColumns))
    console.log('Found unique categories:', Array.from(uniqueCategories))

    // Now process the data using the identified segment columns
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
            
            // Find segment value from any of the identified segment columns
            let segment = 'Unspecified'
            
            for (const segmentCol of segmentColumns) {
              const segmentValue = row[segmentCol]
              if (segmentValue && typeof segmentValue === 'string') {
                const trimmedSegment = segmentValue.trim()
                if (['Entry', 'Mid', 'Luxury', 'Premium', 'Basic', 'Standard', 'High-end', 'Executive', 'Economy', 'Compact'].includes(trimmedSegment)) {
                  segment = trimmedSegment
                  break
                }
              }
            }

            // If no segment found in dedicated columns, check all columns for segment-like values
            if (segment === 'Unspecified') {
              for (const [key, value] of Object.entries(row)) {
                if (value && typeof value === 'string') {
                  const trimmedValue = value.trim()
                  if (['Entry', 'Mid', 'Luxury', 'Premium', 'Basic', 'Standard', 'High-end', 'Executive', 'Economy', 'Compact'].includes(trimmedValue)) {
                    segment = trimmedValue
                    break
                  }
                }
              }
            }

            console.log(`Row processed - Segment: ${segment}, Category: ${category}, Feature: ${feature}`)

            if (!segmentData.has(segment)) {
              segmentData.set(segment, new Map())
            }
            
            const segmentCategories = segmentData.get(segment)!
            if (!segmentCategories.has(category)) {
              segmentCategories.set(category, { features: [], oemCounts: new Map() })
            }
            
            const categoryData = segmentCategories.get(category)!
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
    const segmentsArray = Array.from(segmentData.keys()).sort()
    
    console.log('Final segments found:', segmentsArray)
    console.log('Segment data structure:', segmentData)
    
    // Build chart data
    const chartData = segmentsArray.map(segment => {
      const segmentItem: any = { segment }
      
      categoriesArray.forEach(category => {
        const segmentCategories = segmentData.get(segment)
        const categoryData = segmentCategories?.get(category)
        
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
    const tableData = segmentsArray.map(segment => {
      const segmentCategories = segmentData.get(segment)
      const segmentFeatures: any = { segment }
      
      categoriesArray.forEach(category => {
        const categoryData = segmentCategories?.get(category)
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
