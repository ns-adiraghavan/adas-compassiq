
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Circle, CheckCircle } from "lucide-react"

interface CategoryAnalysisTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
}

const CategoryAnalysisTable = ({ 
  selectedCountry, 
  selectedOEMs, 
  expandedCategory, 
  onCategoryClick 
}: CategoryAnalysisTableProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  // Generate table data
  const tableData = (() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return []
    }

    const categoryOEMCount: Record<string, Record<string, number>> = {}
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory && rowCategory !== '' &&
              featureAvailability === 'available') {
            
            if (!categoryOEMCount[rowCategory]) {
              categoryOEMCount[rowCategory] = {}
            }
            
            if (!categoryOEMCount[rowCategory][rowOEM]) {
              categoryOEMCount[rowCategory][rowOEM] = 0
            }
            
            categoryOEMCount[rowCategory][rowOEM]++
          }
        })
      }
    })

    return Object.entries(categoryOEMCount)
      .map(([category, oemCounts]) => ({
        category,
        ...oemCounts
      }))
      .sort((a, b) => {
        const totalA = Object.values(a).filter(v => typeof v === 'number').reduce((sum: number, count) => sum + (count as number), 0)
        const totalB = Object.values(b).filter(v => typeof v === 'number').reduce((sum: number, count) => sum + (count as number), 0)
        return totalB - totalA
      })
  })()

  // Generate features matrix for expanded category
  const getFeaturesMatrix = (category: string) => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { features: [], matrix: {} }
    }

    const featureOEMMatrix: Record<string, Record<string, { available: boolean, lighthouse: boolean }>> = {}
    const uniqueFeatures = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const rowFeature = row.Feature?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          const lighthouseFeature = row['Lighthouse Feature']?.toString().trim().toLowerCase() === 'yes'
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory === category &&
              rowFeature && rowFeature !== '' &&
              featureAvailability === 'available') {
            
            uniqueFeatures.add(rowFeature)
            
            if (!featureOEMMatrix[rowFeature]) {
              featureOEMMatrix[rowFeature] = {}
            }
            
            featureOEMMatrix[rowFeature][rowOEM] = {
              available: true,
              lighthouse: lighthouseFeature
            }
          }
        })
      }
    })

    const sortedFeatures = Array.from(uniqueFeatures).sort()
    return { features: sortedFeatures, matrix: featureOEMMatrix }
  }

  if (tableData.length === 0) {
    return (
      <div className={`text-center py-8 ${theme.textMuted}`}>
        {selectedOEMs.length === 0 
          ? "Please select at least one OEM to view the analysis"
          : "No data available for the selected filters"
        }
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={`${theme.cardBorder} border-b`}>
              <TableHead className={`${theme.textSecondary} font-medium`}>Category</TableHead>
              {selectedOEMs.map((oem) => (
                <TableHead key={oem} className={`${theme.textSecondary} font-medium text-center`}>
                  {oem.length > 12 ? oem.substring(0, 12) + '...' : oem}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow 
                key={row.category} 
                className={`${theme.cardBorder} border-b hover:bg-gray-800/30 cursor-pointer transition-colors ${
                  expandedCategory === row.category ? 'bg-gray-800/20' : ''
                }`}
                onClick={() => onCategoryClick(row.category)}
              >
                <TableCell className={`${theme.textPrimary} font-medium`}>
                  <div className="flex items-center gap-2">
                    {expandedCategory === row.category ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {row.category}
                  </div>
                </TableCell>
                {selectedOEMs.map((oem) => (
                  <TableCell key={oem} className={`${theme.textSecondary} text-center`}>
                    {row[oem] || 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Expanded Features Matrix Table */}
      {expandedCategory && (
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 mt-4`}>
          <h4 className={`text-md font-medium ${theme.textPrimary} mb-3`}>
            Available Features in {expandedCategory}
          </h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={`${theme.cardBorder} border-b`}>
                  <TableHead className={`${theme.textSecondary} font-medium`}>Feature</TableHead>
                  {selectedOEMs.map((oem) => (
                    <TableHead key={oem} className={`${theme.textSecondary} font-medium text-center`}>
                      {oem.length > 12 ? oem.substring(0, 12) + '...' : oem}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const { features, matrix } = getFeaturesMatrix(expandedCategory)
                  return features.map((feature) => (
                    <TableRow key={feature} className={`${theme.cardBorder} border-b hover:bg-gray-800/20`}>
                      <TableCell className={`${theme.textPrimary} font-medium`}>
                        {feature}
                      </TableCell>
                      {selectedOEMs.map((oem) => (
                        <TableCell key={oem} className="text-center">
                          {matrix[feature]?.[oem] ? (
                            matrix[feature][oem].lighthouse ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <Circle className="h-5 w-5 text-green-500 fill-green-500 mx-auto" />
                            )
                          ) : (
                            <div className="h-5 w-5 mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                })()}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryAnalysisTable
