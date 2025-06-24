
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

  // Get column headers based on grouping mode
  const columnHeaders = (() => {
    if (groupingMode === 'by-oem') {
      return selectedOEMs.map(oem => oem.length > 12 ? oem.substring(0, 12) + '...' : oem)
    } else {
      return extractVehicleSegments(waypointData, selectedCountry, selectedOEMs)
    }
  })()

  // Generate table data - transposed structure
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
              // Initialize all columns to 0
              if (groupingMode === 'by-oem') {
                selectedOEMs.forEach(oem => {
                  categoryData[rowCategory][oem] = 0
                })
              } else {
                extractVehicleSegments(waypointData, selectedCountry, selectedOEMs).forEach(segment => {
                  categoryData[rowCategory][segment] = 0
                })
              }
            }
            
            if (groupingMode === 'by-oem') {
              // Count by OEM - OEMs as columns
              categoryData[rowCategory][rowOEM]++
            } else {
              // Count by segment - segments as columns
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
                  
                  if (categoryData[rowCategory][segmentName] !== undefined) {
                    categoryData[rowCategory][segmentName]++
                  }
                }
              })
            }
          }
        })
      }
    })

    // Convert to array format with category as first column, then OEMs/segments as data columns
    return Object.entries(categoryData)
      .map(([category, counts]) => {
        const row: any = { category }
        columnHeaders.forEach(header => {
          const originalHeader = groupingMode === 'by-oem' 
            ? selectedOEMs.find(oem => (oem.length > 12 ? oem.substring(0, 12) + '...' : oem) === header) || header
            : header
          row[header] = counts[originalHeader] || 0
        })
        return row
      })
      .sort((a, b) => {
        const totalA = columnHeaders.reduce((sum, header) => sum + (a[header] || 0), 0)
        const totalB = columnHeaders.reduce((sum, header) => sum + (b[header] || 0), 0)
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
            
            if (groupingMode === 'by-oem') {
              const displayHeader = rowOEM.length > 12 ? rowOEM.substring(0, 12) + '...' : rowOEM
              featureMatrix[rowFeature][displayHeader] = {
                available: true,
                lighthouse: lighthouseFeature
              }
            } else {
              // For by-segment grouping, map to segments
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
                  
                  featureMatrix[rowFeature][segmentName] = {
                    available: true,
                    lighthouse: lighthouseFeature
                  }
                }
              })
            }
          }
        })
      }
    })

    const sortedFeatures = Array.from(uniqueFeatures).sort()
    return { features: sortedFeatures, matrix: featureMatrix }
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
