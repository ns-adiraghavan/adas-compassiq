
import { VennDiagramData, EntityFeatureData } from "@/utils/vennDiagramUtils"
import { SelectedIntersection } from "@/components/VennDiagram"
import { useTheme } from "@/contexts/ThemeContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface VennDiagramTableProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
  selectedIntersection: SelectedIntersection | null
}

const VennDiagramTable = ({ data, entities, selectedIntersection }: VennDiagramTableProps) => {
  const { theme } = useTheme()

  // Get all intersection data for the table
  const getIntersectionData = () => {
    const intersections = []

    // Unique features for each entity
    entities.forEach(entity => {
      const uniqueFeatures = data.uniqueFeatures[entity.name] || []
      if (uniqueFeatures.length > 0) {
        intersections.push({
          type: 'unique' as const,
          label: `Features unique to ${entity.name}`,
          count: uniqueFeatures.length,
          features: uniqueFeatures,
          entities: [entity.name]
        })
      }
    })

    // Pairwise intersections
    if (entities.length >= 2) {
      entities.forEach((entity1, i) => {
        entities.slice(i + 1).forEach(entity2 => {
          const key = `${entity1.name}-${entity2.name}`
          const reverseKey = `${entity2.name}-${entity1.name}`
          const features = data.featureIntersections[key] || data.featureIntersections[reverseKey] || []
          
          if (features.length > 0) {
            intersections.push({
              type: 'pairwise' as const,
              label: `Features shared between ${entity1.name} and ${entity2.name}`,
              count: features.length,
              features,
              entities: [entity1.name, entity2.name]
            })
          }
        })
      })
    }

    // Three-way intersection
    if (entities.length === 3 && data.sharedFeatures.length > 0) {
      intersections.push({
        type: 'threeway' as const,
        label: `Features shared by all three OEMs`,
        count: data.sharedFeatures.length,
        features: data.sharedFeatures,
        entities: entities.map(e => e.name)
      })
    }

    return intersections
  }

  const intersectionData = getIntersectionData()

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-medium ${theme.textPrimary} mb-4`}>
        Feature Distribution (Set Notation)
      </h3>
      
      <div className="space-y-4">
        {intersectionData.map((intersection, index) => (
          <div key={index} className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className={`text-lg font-medium ${theme.textPrimary}`}>
                {intersection.label}
              </h4>
              <span className={`text-sm font-semibold ${theme.textPrimary} bg-blue-500/20 px-3 py-1 rounded-full`}>
                {intersection.count} features
              </span>
            </div>
            
            {intersection.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {intersection.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className={`text-sm ${theme.textSecondary} bg-gray-500/10 px-3 py-2 rounded border`}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VennDiagramTable
