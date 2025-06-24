import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Circle, CheckCircle } from "lucide-react"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentDetailTableProps {
  selectedItem: string
  itemType: 'oem' | 'segment' | 'category'
  detailedData: Array<{ oem: string; category: string; feature: string; segment: string; isLighthouse: boolean }>
  groupingMode: GroupingMode
  onClose: () => void
}

const VehicleSegmentDetailTable = ({ 
  selectedItem, 
  itemType, 
  detailedData, 
  groupingMode, 
  onClose 
}: VehicleSegmentDetailTableProps) => {
  const { theme } = useTheme()

  const getTitle = () => {
    switch (itemType) {
      case 'oem':
        return `Features for ${selectedItem}`
      case 'segment':
        return `Features in ${selectedItem} Segment`
      case 'category':
        return `Features in ${selectedItem} Category`
      default:
        return `Features for ${selectedItem}`
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
      <div className="flex items-center justify-center min-h-screen">
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg shadow-lg m-4 max-w-3xl w-full`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>{getTitle()}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={`${theme.cardBorder} border-b`}>
                  <TableHead className={`${theme.textSecondary} font-medium`}>Feature</TableHead>
                  <TableHead className={`${theme.textSecondary} font-medium text-center`}>Category</TableHead>
                  {groupingMode === 'by-oem' && (
                    <TableHead className={`${theme.textSecondary} font-medium text-center`}>Segment</TableHead>
                  )}
                  <TableHead className={`${theme.textSecondary} font-medium text-center`}>Lighthouse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedData.map((item) => (
                  <TableRow key={`${item.feature}-${item.oem}-${item.segment}`} className={`${theme.cardBorder} border-b`}>
                    <TableCell className={`${theme.textPrimary} font-medium`}>{item.feature}</TableCell>
                    <TableCell className={`${theme.textSecondary} text-center`}>{item.category}</TableCell>
                    {groupingMode === 'by-oem' && (
                      <TableCell className={`${theme.textSecondary} text-center`}>{item.segment}</TableCell>
                    )}
                    <TableCell className="text-center">
                      {item.isLighthouse ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-500 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleSegmentDetailTable
