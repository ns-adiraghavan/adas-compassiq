import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { Circle, CheckCircle } from "lucide-react"
import { useFeaturesMatrix } from "../hooks/useFeaturesMatrix"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface ExpandedFeaturesTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  groupingMode: GroupingMode
  expandedCategory: string
  mainColumns: string[]
  subColumns: string[]
}

const ExpandedFeaturesTable = ({
  selectedCountry,
  selectedOEMs,
  groupingMode,
  expandedCategory,
  mainColumns,
  subColumns
}: ExpandedFeaturesTableProps) => {
  const { theme } = useTheme()
  const { features, matrix } = useFeaturesMatrix(selectedCountry, selectedOEMs, groupingMode, expandedCategory)

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 mt-4`}>
      <h4 className={`text-md font-medium ${theme.textPrimary} mb-3`}>
        Available Features in {expandedCategory}
      </h4>
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className={`${theme.cardBorder} border-b sticky-header-row-1`}>
              <TableHead className={`${theme.textSecondary} font-medium sticky-column sticky-corner-1`} rowSpan={2}>
                Feature
              </TableHead>
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
            {features.map((feature) => (
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
            ))}
            
            {/* Grand Total Row for Features */}
            <TableRow className={`${theme.cardBorder} border-t-2 bg-gray-800/40 font-bold`}>
              <TableCell className={`${theme.textPrimary} font-bold sticky-column`}>
                Total Features
              </TableCell>
              {mainColumns.map((mainCol) => 
                subColumns.map((subCol) => {
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
  )
}

export default ExpandedFeaturesTable