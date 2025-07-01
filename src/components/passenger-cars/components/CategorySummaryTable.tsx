
import { ChevronDown, ChevronRight } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { getCellColor } from "../utils/categoryTableUtils"

interface CategorySummaryTableProps {
  categoryData: any[]
  selectedOEMs: string[]
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
}

const CategorySummaryTable = ({ 
  categoryData, 
  selectedOEMs, 
  expandedCategory, 
  onCategoryClick 
}: CategorySummaryTableProps) => {
  const { theme } = useTheme()

  // Calculate grand totals for each OEM
  const grandTotals = selectedOEMs.reduce((totals, oem) => {
    totals[oem] = categoryData.reduce((sum, row) => sum + (row[oem] || 0), 0)
    return totals
  }, {} as Record<string, number>)

  const overallTotal = Object.values(grandTotals).reduce((sum, total) => sum + total, 0)

  return (
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
      
      {/* Grand Total Row */}
      <tr className={`${theme.cardBorder} border-t-2 bg-gray-800/40 font-bold`}>
        <td className={`p-3 ${theme.textPrimary} font-bold`}>
          Grand Total
        </td>
        {selectedOEMs.map(oem => (
          <td 
            key={oem}
            className={`p-3 text-center font-bold ${theme.textPrimary}`}
          >
            {grandTotals[oem] || 0}
          </td>
        ))}
      </tr>
    </tbody>
      </table>
    </div>
  )
}

export default CategorySummaryTable
