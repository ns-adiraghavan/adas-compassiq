
import { EntityFeatureData, VennDiagramData } from "@/utils/vennDiagramUtils"
import { useTheme } from "@/contexts/ThemeContext"
import { IntersectionPosition } from "./types"
import { calculateUniqueCount, calculateTwoWayIntersection, calculateThreeWayIntersection } from "./calculations"

interface VennIntersectionLabelsProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
  uniquePositions: Record<string, IntersectionPosition>
  intersectionPositions: Record<string, IntersectionPosition>
  onUniqueClick: (entityName: string) => void
  onPairwiseClick: (entity1: string, entity2: string) => void
  onThreeWayClick: () => void
}

const VennIntersectionLabels = ({ 
  data, 
  entities, 
  uniquePositions, 
  intersectionPositions, 
  onUniqueClick, 
  onPairwiseClick, 
  onThreeWayClick 
}: VennIntersectionLabelsProps) => {
  const { theme } = useTheme()

  return (
    <g>
      {/* Unique counts */}
      {entities.map((entity) => {
        const uniquePos = uniquePositions[entity.name]
        const count = calculateUniqueCount(data, entity.name)
        
        if (!uniquePos || count === 0) return null
        
        return (
          <text
            key={`unique-${entity.name}`}
            x={uniquePos.x}
            y={uniquePos.y}
            textAnchor="middle"
            className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
            onClick={() => onUniqueClick(entity.name)}
          >
            {count}
          </text>
        )
      })}

      {/* Two-way intersections */}
      {entities.length >= 2 && (
        <>
          {entities.map((entity1, i) => 
            entities.slice(i + 1).map((entity2) => {
              const key = `${entity1.name}-${entity2.name}`
              const reverseKey = `${entity2.name}-${entity1.name}`
              const intersectionPos = intersectionPositions[key] || intersectionPositions[reverseKey]
              const count = calculateTwoWayIntersection(data, entity1.name, entity2.name)
              
              if (!intersectionPos || count === 0) return null
              
              return (
                <text
                  key={key}
                  x={intersectionPos.x}
                  y={intersectionPos.y}
                  textAnchor="middle"
                  className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
                  onClick={() => onPairwiseClick(entity1.name, entity2.name)}
                >
                  {count}
                </text>
              )
            })
          )}
        </>
      )}

      {/* Three-way intersection */}
      {entities.length === 3 && (
        (() => {
          const centerPos = intersectionPositions['all']
          const count = calculateThreeWayIntersection(data)
          
          if (!centerPos || count === 0) return null
          
          return (
            <text
              x={centerPos.x}
              y={centerPos.y}
              textAnchor="middle"
              className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
              onClick={onThreeWayClick}
            >
              {count}
            </text>
          )
        })()
      )}
    </g>
  )
}

export default VennIntersectionLabels
