
import { SelectedIntersection } from "@/components/VennDiagram"
import VennCircles from "@/components/venn-diagram/VennCircles"
import VennIntersectionLabels from "@/components/venn-diagram/VennIntersectionLabels"
import { VennDiagramSVGProps } from "@/components/venn-diagram/types"
import { getCirclePositions, getIntersectionPositions, getUniquePositions, SVG_DIMENSIONS } from "@/components/venn-diagram/positioning"

const VennDiagramSVG = ({ data, entities, colors, onIntersectionSelect }: VennDiagramSVGProps) => {
  const handleUniqueClick = (entityName: string) => {
    onIntersectionSelect({
      type: 'unique',
      entities: [entityName],
      features: data.uniqueFeatures[entityName] || []
    })
  }

  const handlePairwiseClick = (entity1: string, entity2: string) => {
    const key = `${entity1}-${entity2}`
    const reverseKey = `${entity2}-${entity1}`
    const features = data.featureIntersections[key] || data.featureIntersections[reverseKey] || []
    
    onIntersectionSelect({
      type: 'pairwise',
      entities: [entity1, entity2],
      features
    })
  }

  const handleThreeWayClick = () => {
    onIntersectionSelect({
      type: 'threeway',
      entities: entities.map(e => e.name),
      features: data.sharedFeatures
    })
  }

  const positions = getCirclePositions(entities)
  const intersectionPositions = getIntersectionPositions(entities, positions)
  const uniquePositions = getUniquePositions(entities, positions)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        width={SVG_DIMENSIONS.width} 
        height={SVG_DIMENSIONS.height} 
        viewBox={`0 0 ${SVG_DIMENSIONS.width} ${SVG_DIMENSIONS.height}`} 
        className="max-w-full max-h-full"
      >
        <VennCircles
          entities={entities}
          positions={positions}
          colors={colors}
          onUniqueClick={handleUniqueClick}
        />
        
        <VennIntersectionLabels
          data={data}
          entities={entities}
          uniquePositions={uniquePositions}
          intersectionPositions={intersectionPositions}
          onUniqueClick={handleUniqueClick}
          onPairwiseClick={handlePairwiseClick}
          onThreeWayClick={handleThreeWayClick}
        />
      </svg>
    </div>
  )
}

export default VennDiagramSVG
