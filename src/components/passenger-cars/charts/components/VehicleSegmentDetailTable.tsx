
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "@/contexts/ThemeContext"
import { X } from "lucide-react"

interface VehicleSegmentDetailTableProps {
  selectedItem: string
  itemType: 'oem' | 'segment'
  detailedData: Array<{ oem: string; category: string; feature: string }>
  onClose: () => void
}

const VehicleSegmentDetailTable = ({ 
  selectedItem, 
  itemType, 
  detailedData, 
  onClose 
}: VehicleSegmentDetailTableProps) => {
  const { theme } = useTheme()

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
              <TableHead>OEM</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Feature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.oem}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.feature}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className={`mt-3 text-sm ${theme.textMuted}`}>
        Showing {detailedData.length} features
      </div>
    </div>
  )
}

export default VehicleSegmentDetailTable
