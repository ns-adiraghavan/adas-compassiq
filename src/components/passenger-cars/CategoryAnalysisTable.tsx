
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import { ChevronDown, ChevronRight, Check } from "lucide-react"

interface CategoryAnalysisTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  businessModelFilter?: string
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
  showBusinessModelInDetails?: boolean
}

const CategoryAnalysisTable = ({ 
  selectedCountry, 
  selectedOEMs, 
  businessModelFilter,
  expandedCategory, 
  onCategoryClick,
  showBusinessModelInDetails = false
}: CategoryAnalysisTableProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  const { categoryData, expandedFeaturesData } = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { categoryData: [], expandedFeaturesData: {} }
    }

    const categoryFeatureData: Record<string, Record<string, number>> = {}
    const categoryFeatures: Record<string, any[]> = {}
    const allCategories = new Set<string>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            // Filter by business model type if provided
            if (businessModelFilter) {
              const businessModelType = row['Business Model Type']?.toString().trim() || 'Unknown'
              if (businessModelType !== businessModelFilter) {
                return
              }
            }
            
            const category = row.Category?.toString().trim() || 'Unknown'
            const oem = row.OEM?.toString().trim()
            
            allCategories.add(category)
            
            if (!categoryFeatureData[category]) {
              categoryFeatureData[category] = {}
              categoryFeatures[category] = []
            }
            
            categoryFeatureData[category][oem] = (categoryFeatureData[category][oem] || 0) + 1
            categoryFeatures[category].push(row)
          }
        })
      }
    })

    const categoryData = Array.from(allCategories).map(category => {
      const row: any = { name: category }
      selectedOEMs.forEach(oem => {
        const count = categoryFeatureData[category]?.[oem] || 0
        row[oem] = count
      })
      return row
    }).filter(row => selectedOEMs.some(oem => row[oem] > 0)).sort((a, b) => {
      const totalA = selectedOEMs.reduce((sum, oem) => sum + (a[oem] || 0), 0)
      const totalB = selectedOEMs.reduce((sum, oem) => sum + (b[oem] || 0), 0)
      return totalB - totalA
    })

    // Process features for expanded category
    const expandedFeaturesData: Record<string, Record<string, { available: boolean, businessModel?: string }>> = {}
    if (expandedCategory && categoryFeatures[expandedCategory]) {
      categoryFeatures[expandedCategory].forEach((feature: any) => {
        const featureName = feature.Feature?.toString().trim()
        const oem = feature.OEM?.toString().trim()
        
        if (!expandedFeaturesData[featureName]) {
          expandedFeaturesData[featureName] = {}
        }
        
        // Always show availability with additional business model info if needed
        expandedFeaturesData[featureName][oem] = {
          available: true,
          businessModel: showBusinessModelInDetails ? 
            feature['Business Model Type']?.toString().trim() || 'Unknown' : undefined
        }
      })
    }

    return { categoryData, expandedFeaturesData }
  }, [waypointData, selectedCountry, selectedOEMs, businessModelFilter, expandedCategory, showBusinessModelInDetails])

  const getCellColor = (value: number, maxInRow: number) => {
    if (value === 0) return 'transparent'
    const intensity = value / maxInRow
    if (intensity > 0.7) return 'rgba(59, 130, 246, 0.8)'
    if (intensity > 0.4) return 'rgba(59, 130, 246, 0.5)'
    return 'rgba(59, 130, 246, 0.3)'
  }

  if (categoryData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className={`${theme.textMuted}`}>No data available for selected filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Summary Table */}
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
            </tr>
          </thead>
          <tbody>
            {categoryData.map((row, index) => {
              const maxInRow = Math.max(...selectedOEMs.map(oem => row[oem] || 0))
              const isExpanded = expandedCategory === row.name
              
              return (
                <tr 
                  key={row.name} 
                  className={`${theme.cardBorder} border-b hover:${theme.cardBackground} cursor-pointer transition-colors ${isExpanded ? theme.cardBackground : ''}`}
                  onClick={() => onCategoryClick(row.name)}
                >
                  <td className={`p-3 ${theme.textSecondary} font-medium`}>
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      {row.name}
                    </div>
                  </td>
                  {selectedOEMs.map(oem => {
                    const value = row[oem] || 0
                    return (
                      <td 
                        key={oem} 
                        className="p-3 text-center font-semibold"
                        style={{ 
                          backgroundColor: getCellColor(value, maxInRow),
                          color: value > 0 ? 'white' : 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {value > 0 ? value : '-'}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded Features Table */}
      {expandedCategory && Object.keys(expandedFeaturesData).length > 0 && (
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-6`}>
          <h4 className={`text-xl font-semibold ${theme.textPrimary} mb-4`}>
            Features in {expandedCategory} Category{businessModelFilter && ` (${businessModelFilter})`}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${theme.cardBorder} border-b`}>
                  <th className={`text-left p-4 ${theme.textPrimary} font-medium`}>Feature</th>
                  {selectedOEMs.map(oem => (
                    <th key={oem} className={`text-center p-4 ${theme.textPrimary} font-medium min-w-[120px]`}>
                      {oem}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(expandedFeaturesData).map(([featureName, oemData], index) => (
                  <tr key={index} className={`${theme.cardBorder} border-b hover:${theme.cardBackground} transition-colors`}>
                    <td className={`p-4 ${theme.textSecondary} font-medium`}>
                      {featureName}
                    </td>
                    {selectedOEMs.map(oem => {
                      const data = oemData[oem]
                      return (
                        <td key={oem} className={`p-4 text-center ${theme.textSecondary}`}>
                          {data ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                              {showBusinessModelInDetails && data.businessModel && (
                                <span className="text-xs text-gray-500">
                                  {data.businessModel}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryAnalysisTable
