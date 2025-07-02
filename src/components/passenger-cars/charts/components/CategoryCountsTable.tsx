import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { ChevronDown, ChevronRight } from "lucide-react"

interface CategoryCountsTableProps {
  categories: string[]
  mainColumns: string[]
  subColumns: string[]
  categoryData: Record<string, Record<string, Record<string, number>>>
  grandTotals: Record<string, Record<string, number>>
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
}

const CategoryCountsTable = ({
  categories,
  mainColumns,
  subColumns,
  categoryData,
  grandTotals,
  expandedCategory,
  onCategoryClick
}: CategoryCountsTableProps) => {
  const { theme } = useTheme()

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow className={`${theme.cardBorder} border-b sticky-header-row-1`}>
            <TableHead className={`${theme.textSecondary} font-medium sticky-column sticky-corner-1`} rowSpan={2}>
              Category
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
  )
}

export default CategoryCountsTable