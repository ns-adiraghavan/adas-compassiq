
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { ChevronDown, ChevronRight, Circle, CheckCircle } from "lucide-react"
import { useWaypointData } from "@/hooks/useWaypointData"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentCategoryTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  groupingMode: GroupingMode
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
}

const VehicleSegmentCategoryTable = ({ 
  selectedCountry, 
  selectedOEMs, 
  groupingMode,
  expandedCategory, 
  onCategoryClick 
}: VehicleSegmentCategoryTableProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  // Generate table data based on grouping mode
  const tableData = (() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return []
    }

    const categoryData: Record<string, Record<string, number>> = {}
    
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
            
            if (!categoryData[rowCategory]) {
              categoryData[rowCategory] = {}
            }
            
            const groupKey = groupingMode === 'by-oem' ? rowOEM : rowCategory
            
            if (!categoryData[rowCategory][groupKey]) {
              categoryData[rowCategory][groupKey] = 0
            }
            
            categoryData[rowCategory][groupKey]++
          }
        })
      }
    })

    return Object.entries(categoryData)
      .map(([category, counts]) => ({
        category,
        ...counts
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

    const featureMatrix: Record<string, Record<string, { available: boolean, lighthouse: boolean }>> = {}
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
            
            if (!featureMatrix[rowFeature]) {
              featureMatrix[rowFeature] = {}
            }
            
            const matrixKey = groupingMode === 'by-oem' ? rowOEM : rowCategory
            featureMatrix[rowFeature][matrixKey] = {
              available: true,
              lighthouse: lighthouseFeature
            }
          }
        })
      }
    })

    const sortedFeatures = Array.from(uniqueFeatures).sort()
    return { features: sortedFeatures, matrix: featureMatrix }
  }

  // Get column headers based on grouping mode
  const getColumnHeaders = () => {
    if (groupingMode === 'by-oem') {
      return selectedOEMs.map(oem => oem.length > 12 ? oem.substring(0, 12) + '...' : oem)
    } else {
      // For by-segment grouping, we need to get available segments
      const segments = new Set<string>()
      waypointData?.csvData?.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.Country === selectedCountry && selectedOEMs.includes(row.OEM)) {
              // Extract segment information (this would need to be adapted based on your segment detection logic)
              if (row.Category) segments.add(row.Category)
            }
          })
        }
      })
      return Array.from(segments).sort()
    }
  }

  const columnHeaders = getColumnHeaders()

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
              {columnHeaders.map((header) => (
                <TableHead key={header} className={`${theme.textSecondary} font-medium text-center`}>
                  {header}
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
                {columnHeaders.map((header) => (
                  <TableCell key={header} className={`${theme.textSecondary} text-center`}>
                    {row[header] || 0}
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
                  {columnHeaders.map((header) => (
                    <TableHead key={header} className={`${theme.textSecondary} font-medium text-center`}>
                      {header}
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
                      {columnHeaders.map((header) => (
                        <TableCell key={header} className="text-center">
                          {matrix[feature]?.[header] ? (
                            matrix[feature][header].lighthouse ? (
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

export default VehicleSegmentCategoryTable
