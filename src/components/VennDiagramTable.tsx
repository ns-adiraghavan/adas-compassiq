
import { VennDiagramData, EntityFeatureData } from "@/utils/vennDiagramUtils"
import { SelectedIntersection } from "@/components/VennDiagram"
import { useTheme } from "@/contexts/ThemeContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VennDiagramTableProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
  selectedIntersection: SelectedIntersection | null
}

const VennDiagramTable = ({ data, entities, selectedIntersection }: VennDiagramTableProps) => {
  const { theme } = useTheme()

  // If no intersection is selected, show a message
  if (!selectedIntersection) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <h3 className={`text-xl font-medium ${theme.textPrimary} mb-4`}>
          Feature Distribution (Set Notation)
        </h3>
        <div className={`flex items-center justify-center py-8 ${theme.textMuted}`}>
          <p>Click on a section of the Venn diagram to view feature details</p>
        </div>
      </div>
    )
  }

  // Get the label for the selected intersection
  const getIntersectionLabel = () => {
    if (selectedIntersection.type === 'unique') {
      return `Features unique to ${selectedIntersection.entities[0]}`
    } else if (selectedIntersection.type === 'pairwise') {
      return `Features shared between ${selectedIntersection.entities.join(' and ')}`
    } else if (selectedIntersection.type === 'threeway') {
      return `Features shared by all three OEMs`
    }
    return 'Selected Features'
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-medium ${theme.textPrimary} mb-4`}>
        Feature Distribution (Set Notation)
      </h3>
      
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`text-lg font-medium ${theme.textPrimary}`}>
            {getIntersectionLabel()}
          </h4>
          <span className={`text-sm font-semibold ${theme.textPrimary} bg-blue-500/20 px-3 py-1 rounded-full`}>
            {selectedIntersection.features.length} features
          </span>
        </div>
        
        {selectedIntersection.features.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={`${theme.cardBorder} border-b`}>
                  <TableHead className={`text-left ${theme.textPrimary} font-medium`}>
                    #
                  </TableHead>
                  <TableHead className={`text-left ${theme.textPrimary} font-medium`}>
                    Feature Name
                  </TableHead>
                  <TableHead className={`text-center ${theme.textPrimary} font-medium`}>
                    Availability
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedIntersection.features.map((feature, index) => (
                  <TableRow 
                    key={index}
                    className={`${theme.cardBorder} border-b hover:${theme.cardBackground} transition-colors`}
                  >
                    <TableCell className={`${theme.textSecondary} font-medium w-16`}>
                      {index + 1}
                    </TableCell>
                    <TableCell className={`${theme.textSecondary} font-medium`}>
                      {feature}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        Available
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className={`${theme.textMuted} text-center py-8`}>
            <p>No features found for this intersection</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VennDiagramTable
