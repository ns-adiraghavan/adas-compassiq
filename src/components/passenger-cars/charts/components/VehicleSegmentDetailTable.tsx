
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { X, Check } from "lucide-react"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentDetailTableProps {
  selectedItem: string
  itemType: 'oem' | 'segment'
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

  // Determine the third column header based on grouping mode
  const thirdColumnHeader = groupingMode === 'by-oem' ? 'Segment' : 'OEM'

  const FeatureStatusIcon = ({ isLighthouse }: { isLighthouse: boolean }) => {
    if (isLighthouse) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={10} className="text-white" />
          </div>
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center">
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm mt-6`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-lg font-medium ${theme.textPrimary}`}>
          Detailed Features for {selectedItem}
        </h4>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${theme.cardBorder} border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <X size={16} className={theme.textSecondary} />
        </button>
      </div>
      
      <div className="overflow-x-auto max-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Feature</TableHead>
              <TableHead>{thirdColumnHeader}</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>{item.feature}</TableCell>
                <TableCell>
                  {groupingMode === 'by-oem' ? item.segment : item.oem}
                </TableCell>
                <TableCell>
                  <FeatureStatusIcon isLighthouse={item.isLighthouse} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className={`mt-3 text-sm ${theme.textMuted} flex items-center gap-4`}>
        <span>Showing {detailedData.length} features</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={10} className="text-white" />
            </div>
            <span>Lighthouse Feature</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleSegmentDetailTable
