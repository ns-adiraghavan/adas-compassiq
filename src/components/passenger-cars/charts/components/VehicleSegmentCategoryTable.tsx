
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { ChevronDown, ChevronRight, Circle, CheckCircle } from "lucide-react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { extractVehicleSegments } from "../utils/segmentDetection"
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

  // Get available segments and OEMs
  const availableSegments = extractVehicleSegments(waypointData, selectedCountry, selectedOEMs)
  const availableOEMs = selectedOEMs

  // Generate table data structure based on grouping mode
  const getTableStructure = () => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { categories: [], mainColumns: [], subColumns: [] }
    }

    const categoryData: Record<string, Record<string, Record<string, number>>> = {}
    
    // Process data to count features
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
            
            // Detect segments for this row
            const firstRow = file.data[0]
            const allColumns = Object.keys(firstRow)
            const segmentPatterns = [
              /segment/i, /entry/i, /mid/i, /premium/i, /luxury/i, /basic/i, /standard/i, /high/i, /executive/i
            ]
            
            const segmentColumns = allColumns.filter(column => 
              segmentPatterns.some(pattern => pattern.test(column))
            )
            
            segmentColumns.forEach(segmentCol => {
              const segmentValue = row[segmentCol]?.toString().trim().toLowerCase()
              
              if (segmentValue && segmentValue !== 'n/a' && segmentValue !== '' && 
                  (segmentValue === 'yes' || segmentValue === 'y' || segmentValue === '1' || 
                   segmentValue === 'true' || segmentValue === 'available')) {
                
                let segmentName = segmentCol.replace(/segment/i, '').trim()
                if (segmentName.toLowerCase().includes('entry')) segmentName = 'Entry'
                else if (segmentName.toLowerCase().includes('mid')) segmentName = 'Mid'
                else if (segmentName.toLowerCase().includes('premium')) segmentName = 'Premium'
                else if (segmentName.toLowerCase().includes('luxury')) segmentName = 'Luxury'
                else segmentName = segmentCol
                
                if (groupingMode === 'by-segment') {
                  // Segment -> OEM structure
                  if (!categoryData[rowCategory][segmentName]) {
                    categoryData[rowCategory][segmentName] = {}
                  }
                  categoryData[rowCategory][segmentName][rowOEM] = (categoryData[rowCategory][segmentName][rowOEM] || 0) + 1
                } else {
                  // OEM -> Segment structure
                  if (!categoryData[rowCategory][rowOEM]) {
                    categoryData[rowCategory][rowOEM] = {}
                  }
                  categoryData[rowCategory][rowOEM][segmentName] = (categoryData[rowCategory][rowOEM][segmentName] || 0) + 1
                }
              }
            })
          }
        })
      }
    })

    const categories = Object.keys(categoryData).sort()
    const mainColumns = groupingMode === 'by-segment' ? availableSegments : availableOEMs
    const subColumns = groupingMode === 'by-segment' ? availableOEMs : availableSegments

    return { categories, mainColumns, subColumns, categoryData }
  }

  const { categories, mainColumns, subColumns, categoryData } = getTableStructure()

  // Calculate grand totals for the main table
  const calculateGrandTotals = () => {
    const totals: Record<string, Record<string, number>> = {}
    
    mainColumns.forEach(mainCol => {
      totals[mainCol] = {}
      subColumns.forEach(subCol => {
        let sum = 0
        for (const category of categories) {
          sum += (categoryData?.[category]?.[mainCol]?.[subCol] || 0)
        }
        totals[mainCol][subCol] = sum
      })
    })
    
    return totals
  }

  const grandTotals = calculateGrandTotals()

  // Generate features matrix for expanded category
  const getFeaturesMatrix = (category: string) => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { features: [], matrix: {} }
    }

    const featureMatrix: Record<string, Record<string, Record<string, { available: boolean, lighthouse: boolean }>>> = {}
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
            
            // Map to segments and OEMs
            const firstRow = file.data[0]
            const allColumns = Object.keys(firstRow)
            const segmentPatterns = [
              /segment/i, /entry/i, /mid/i, /premium/i, /luxury/i, /basic/i, /standard/i, /high/i, /executive/i
            ]
            
            const segmentColumns = allColumns.filter(column => 
              segmentPatterns.some(pattern => pattern.test(column))
            )
            
            segmentColumns.forEach(segmentCol => {
              const segmentValue = row[segmentCol]?.toString().trim().toLowerCase()
              
              if (segmentValue && segmentValue !== 'n/a' && segmentValue !== '' && 
                  (segmentValue === 'yes' || segmentValue === 'y' || segmentValue === '1' || 
                   segmentValue === 'true' || segmentValue === 'available')) {
                
                let segmentName = segmentCol.replace(/segment/i, '').trim()
                if (segmentName.toLowerCase().includes('entry')) segmentName = 'Entry'
                else if (segmentName.toLowerCase().includes('mid')) segmentName = 'Mid'
                else if (segmentName.toLowerCase().includes('premium')) segmentName = 'Premium'
                else if (segmentName.toLowerCase().includes('luxury')) segmentName = 'Luxury'
                else segmentName = segmentCol
                
                if (groupingMode === 'by-segment') {
                  if (!featureMatrix[rowFeature][segmentName]) {
                    featureMatrix[rowFeature][segmentName] = {}
                  }
                  featureMatrix[rowFeature][segmentName][rowOEM] = {
                    available: true,
                    lighthouse: lighthouseFeature
                  }
                } else {
                  if (!featureMatrix[rowFeature][rowOEM]) {
                    featureMatrix[rowFeature][rowOEM] = {}
                  }
                  featureMatrix[rowFeature][rowOEM][segmentName] = {
                    available: true,
                    lighthouse: lighthouseFeature
                  }
                }
              }
            })
          }
        })
      }
    })

    const sortedFeatures = Array.from(uniqueFeatures).sort()
    return { features: sortedFeatures, matrix: featureMatrix }
  }

  if (categories.length === 0) {
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
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className={`${theme.cardBorder} border-b sticky-header-row-1`}>
              <TableHead className={`${theme.textSecondary} font-medium sticky-column sticky-corner-1`} rowSpan={2}>Category</TableHead>
              {mainColumns.map((mainCol) => (
                <TableHead 
                  key={mainCol} 
                  className={`${theme.textSecondary} font-medium text-center border-l ${theme.cardBorder}`}
                  colSpan={subColumns.length}
                >
                  {mainCol}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className={`${theme.cardBorder} border-b sticky-header-row-2`}>
              {mainColumns.map((mainCol) => 
                subColumns.map((subCol) => (
                  <TableHead 
                    key={`${mainCol}-${subCol}`} 
                    className={`${theme.textSecondary} font-medium text-center text-xs border-l ${theme.cardBorder}`}
                  >
                    {subCol}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow 
                key={category} 
                className={`${theme.cardBorder} border-b hover:bg-gray-800/30 cursor-pointer transition-colors ${
                  expandedCategory === category ? 'bg-gray-800/20' : ''
                }`}
                onClick={() => onCategoryClick(category)}
              >
                <TableCell className={`${theme.textPrimary} font-medium sticky-column`}>
                  <div className="flex items-center gap-2">
                    {expandedCategory === category ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {category}
                  </div>
                </TableCell>
                {mainColumns.map((mainCol) => 
                  subColumns.map((subCol) => (
                    <TableCell 
                      key={`${mainCol}-${subCol}`} 
                      className={`${theme.textSecondary} text-center border-l ${theme.cardBorder}`}
                    >
                      {categoryData?.[category]?.[mainCol]?.[subCol] || 0}
                    </TableCell>
                ))
              )}
            </TableRow>
          ))}
          
          {/* Grand Total Row */}
          <TableRow className={`${theme.cardBorder} border-t-2 bg-gray-800/40 font-bold`}>
            <TableCell className={`${theme.textPrimary} font-bold sticky-column`}>
              Grand Total
            </TableCell>
            {mainColumns.map((mainCol) => 
              subColumns.map((subCol) => (
                <TableCell 
                  key={`total-${mainCol}-${subCol}`} 
                  className={`${theme.textPrimary} text-center border-l ${theme.cardBorder} font-bold`}
                >
                  {grandTotals[mainCol]?.[subCol] || 0}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableBody>
        </Table>
      </div>

      {/* Expanded Features Matrix Table */}
      {expandedCategory && (
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 mt-4`}>
          <h4 className={`text-md font-medium ${theme.textPrimary} mb-3`}>
            Available Features in {expandedCategory}
          </h4>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow className={`${theme.cardBorder} border-b sticky-header-row-1`}>
                  <TableHead className={`${theme.textSecondary} font-medium sticky-column sticky-corner-1`} rowSpan={2}>Feature</TableHead>
                  {mainColumns.map((mainCol) => (
                    <TableHead 
                      key={mainCol} 
                      className={`${theme.textSecondary} font-medium text-center border-l ${theme.cardBorder}`}
                      colSpan={subColumns.length}
                    >
                      {mainCol}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow className={`${theme.cardBorder} border-b sticky-header-row-2`}>
                  {mainColumns.map((mainCol) => 
                    subColumns.map((subCol) => (
                      <TableHead 
                        key={`${mainCol}-${subCol}`} 
                        className={`${theme.textSecondary} font-medium text-center text-xs border-l ${theme.cardBorder}`}
                      >
                        {subCol}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const { features, matrix } = getFeaturesMatrix(expandedCategory)
                  return features.map((feature) => (
                    <TableRow key={feature} className={`${theme.cardBorder} border-b hover:bg-gray-800/20`}>
                      <TableCell className={`${theme.textPrimary} font-medium sticky-column`}>
                        {feature}
                      </TableCell>
                      {mainColumns.map((mainCol) => 
                        subColumns.map((subCol) => (
                          <TableCell key={`${mainCol}-${subCol}`} className={`text-center border-l ${theme.cardBorder}`}>
                            {matrix[feature]?.[mainCol]?.[subCol] ? (
                              matrix[feature][mainCol][subCol].lighthouse ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <Circle className="h-5 w-5 text-green-500 fill-green-500 mx-auto" />
                              )
                            ) : (
                              <div className="h-5 w-5 mx-auto" />
                            )}
                          </TableCell>
                      ))
                    )}
                  </TableRow>
                ))
              })()}
              
              {/* Grand Total Row for Features */}
              <TableRow className={`${theme.cardBorder} border-t-2 bg-gray-800/40 font-bold`}>
                <TableCell className={`${theme.textPrimary} font-bold sticky-column`}>
                  Total Features
                </TableCell>
                {mainColumns.map((mainCol) => 
                  subColumns.map((subCol) => {
                    const { features, matrix } = getFeaturesMatrix(expandedCategory)
                    const totalFeatures = features.filter(feature => 
                      matrix[feature]?.[mainCol]?.[subCol]
                    ).length
                    return (
                      <TableCell 
                        key={`feature-total-${mainCol}-${subCol}`} 
                        className={`${theme.textPrimary} text-center border-l ${theme.cardBorder} font-bold`}
                      >
                        {totalFeatures}
                      </TableCell>
                    )
                  })
                )}
              </TableRow>
            </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleSegmentCategoryTable
