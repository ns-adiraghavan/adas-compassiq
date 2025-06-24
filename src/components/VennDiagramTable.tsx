
import { VennDiagramData, EntityFeatureData } from "@/utils/vennDiagramUtils"
import { SelectedIntersection } from "@/components/VennDiagram"
import { useTheme } from "@/contexts/ThemeContext"

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
        <div className="flex justify-between items-center mb-3">
          <h4 className={`text-lg font-medium ${theme.textPrimary}`}>
            {getIntersectionLabel()}
          </h4>
          <span className={`text-sm font-semibold ${theme.textPrimary} bg-blue-500/20 px-3 py-1 rounded-full`}>
            {selectedIntersection.features.length} features
          </span>
        </div>
        
        {selectedIntersection.features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedIntersection.features.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className={`text-sm ${theme.textSecondary} bg-gray-500/10 px-3 py-2 rounded border`}
              >
                {feature}
              </div>
            ))}
          </div>
        ) : (
          <div className={`${theme.textMuted} text-center py-4`}>
            No features found for this intersection
          </div>
        )}
      </div>
    </div>
  )
}

export default VennDiagramTable
