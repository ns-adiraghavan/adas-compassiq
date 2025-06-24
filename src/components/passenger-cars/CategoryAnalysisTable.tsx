
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import { ChevronDown, ChevronRight } from "lucide-react"

interface CategoryAnalysisTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  businessModelFilter?: string
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
}

const CategoryAnalysisTable = ({ 
  selectedCountry, 
  selectedOEMs, 
  businessModelFilter,
  expandedCategory, 
  onCategoryClick 
}: CategoryAnalysisTableProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  const { categoryData, featureData } = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { categoryData: [], featureData: new Map() }
    }

    const categoryCount: Record<string, Record<string, number>> = {}
    const detailedFeatures = new Map<string, Array<{ feature: string, oem: string, businessModel: string, isLighthouse: boolean }>>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const category = row.Category?.toString().trim() || 'General'
            const oem = row.OEM?.toString().trim()
            const feature = row.Feature?.toString().trim()
            const businessModel = row['Business Model']?.toString().trim() || 'Unknown'
            const isLighthouse = row['Lighthouse Feature']?.toString().toLowerCase() === 'yes'
            
            // Apply business model filter if provided
            if (businessModelFilter && businessModel !== businessModelFilter) {
              return
            }
            
            if (!categoryCount[category]) {
              categoryCount[category] = {}
            }
            
            categoryCount[category][oem] = (categoryCount[category][oem] || 0) + 1
            
            // Store detailed feature information
            if (!detailedFeatures.has(category)) {
              detailedFeatures.set(category, [])
            }
            detailedFeatures.get(category)!.push({ feature, oem, businessModel, isLighthouse })
          }
        })
      }
    })

    const categoryData = Object.entries(categoryCount).map(([category, oemCounts]) => {
      const row: any = { category }
      let total = 0
      selectedOEMs.forEach(oem => {
        const count = oemCounts[oem] || 0
        row[oem] = count
        total += count
      })
      row.total = total
      return row
    }).filter(row => row.total > 0).sort((a, b) => b.total - a.total)

    return { categoryData, featureData: detailedFeatures }
  }, [waypointData, selectedCountry, selectedOEMs, businessModelFilter])

  const getCellColor = (value: number, maxInRow: number) => {
    if (value === 0) return 'transparent'
    const intensity = value / maxInRow
    if (intensity > 0.7) return 'rgba(16, 185, 129, 0.8)' // Strong green
    if (intensity > 0.4) return 'rgba(16, 185, 129, 0.5)' // Medium green
    return 'rgba(16, 185, 129, 0.3)' // Light green
  }

  if (categoryData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className={`${theme.textMuted}`}>
          No data available for selected filters
          {businessModelFilter && ` and business model: ${businessModelFilter}`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${theme.cardBorder} border-b`}>
              <th className={`text-left p-3 ${theme.textPrimary} font-medium`}>Category</th>
              {selectedOEMs.map(oem => (
                <th key={oem} className={`text-center p-3 ${theme.textPrimary} font-medium min-w-[100px]`}>
                  {oem}
                </th>
              ))}
              <th className={`text-center p-3 ${theme.textPrimary} font-medium`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((row) => {
              const maxInRow = Math.max(...selectedOEMs.map(oem => row[oem] || 0))
              const isExpanded = expandedCategory === row.category
              
              return (
                <tr key={row.category}>
                  <td colSpan={selectedOEMs.length + 2} className="p-0">
                    <div 
                      className={`flex items-center p-3 ${theme.cardBorder} border-b hover:${theme.cardBackground} cursor-pointer transition-colors`}
                      onClick={() => onCategoryClick(row.category)}
                    >
                      <div className="flex items-center flex-1">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />
                        )}
                        <span className={`${theme.textSecondary} font-medium`}>
                          {row.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {selectedOEMs.map(oem => {
                          const value = row[oem] || 0
                          return (
                            <div 
                              key={oem} 
                              className="text-center font-semibold min-w-[80px] px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: getCellColor(value, maxInRow),
                                color: value > 0 ? 'white' : 'rgba(255,255,255,0.4)'
                              }}
                            >
                              {value > 0 ? value : '-'}
                            </div>
                          )
                        })}
                        <div className={`text-center font-bold ${theme.textPrimary} min-w-[60px]`}>
                          {row.total}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Feature Details */}
                    {isExpanded && featureData.has(row.category) && (
                      <div className={`${theme.cardBackground} border-l-4 border-green-500 ml-6 mr-2 mb-2`}>
                        <div className="p-4">
                          <h4 className={`text-sm font-medium ${theme.textPrimary} mb-3`}>
                            Features in {row.category}
                            {businessModelFilter && ` (${businessModelFilter})`}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                            {featureData.get(row.category)!.map((item, index) => (
                              <div 
                                key={index} 
                                className={`text-xs p-2 rounded ${theme.cardBorder} border flex justify-between items-center`}
                              >
                                <div>
                                  <div className={`${theme.textSecondary} font-medium`}>{item.feature}</div>
                                  <div className={`${theme.textMuted} text-xs`}>{item.oem}</div>
                                </div>
                                {item.isLighthouse && (
                                  <div className="text-yellow-400 text-xs font-semibold">★</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryAnalysisTable
