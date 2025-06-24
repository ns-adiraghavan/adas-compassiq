
import { EntityFeatureData, VennDiagramData } from "@/utils/vennDiagramUtils"
import { SelectedIntersection } from "@/components/VennDiagram"
import { useTheme } from "@/contexts/ThemeContext"

interface VennDiagramSVGProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
  colors: Array<{ fill: string; fillOpacity: string; stroke: string; label: string }>
  onIntersectionSelect: (intersection: SelectedIntersection) => void
}

const VennDiagramSVG = ({ data, entities, colors, onIntersectionSelect }: VennDiagramSVGProps) => {
  const { theme } = useTheme()

  const calculateUniqueCount = (entityName: string): number => {
    return data.uniqueFeatures[entityName]?.length || 0
  }

  const calculateTwoWayIntersection = (entity1: string, entity2: string): number => {
    const key = `${entity1}-${entity2}`
    const reverseKey = `${entity2}-${entity1}`
    return data.featureIntersections[key]?.length || data.featureIntersections[reverseKey]?.length || 0
  }

  const calculateThreeWayIntersection = (): number => {
    return data.featureIntersections['all']?.length || 0
  }

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

  // SVG dimensions
  const width = 600
  const height = 400
  const radius = 120

  // Circle positions based on entity count
  const getCirclePositions = () => {
    if (entities.length === 1) {
      return [{ cx: width / 2, cy: height / 2 }]
    } else if (entities.length === 2) {
      return [
        { cx: width / 2 - 60, cy: height / 2 },
        { cx: width / 2 + 60, cy: height / 2 }
      ]
    } else { // 3 entities
      return [
        { cx: width / 2, cy: height / 2 - 50 },
        { cx: width / 2 - 70, cy: height / 2 + 50 },
        { cx: width / 2 + 70, cy: height / 2 + 50 }
      ]
    }
  }

  const positions = getCirclePositions()

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full max-h-full">
        {/* Circles */}
        {entities.map((entity, index) => {
          const position = positions[index]
          const color = colors[index] || colors[0]
          
          return (
            <g key={entity.name}>
              <circle
                cx={position.cx}
                cy={position.cy}
                r={radius}
                fill={color.fill}
                fillOpacity={color.fillOpacity}
                stroke={color.stroke}
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleUniqueClick(entity.name)}
              />
              
              {/* Entity label */}
              <text
                x={position.cx}
                y={entities.length === 1 ? position.cy - radius - 20 : position.cy - radius - 10}
                textAnchor="middle"
                className={`text-sm font-medium ${theme.textPrimary} fill-current`}
              >
                {entity.name}
              </text>
              
              {/* Unique count */}
              <text
                x={position.cx}
                y={entities.length === 1 ? position.cy + 5 : (
                  entities.length === 2 
                    ? position.cy + (index === 0 ? -30 : 30)
                    : position.cy + (index === 0 ? -40 : 30)
                )}
                textAnchor="middle"
                className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
                onClick={() => handleUniqueClick(entity.name)}
              >
                {calculateUniqueCount(entity.name)}
              </text>
            </g>
          )
        })}

        {/* Two-way intersections */}
        {entities.length >= 2 && (
          <>
            {entities.map((entity1, i) => 
              entities.slice(i + 1).map((entity2, j) => {
                const actualJ = i + 1 + j
                const pos1 = positions[i]
                const pos2 = positions[actualJ]
                const midX = (pos1.cx + pos2.cx) / 2
                const midY = (pos1.cy + pos2.cy) / 2
                const count = calculateTwoWayIntersection(entity1.name, entity2.name)
                
                return (
                  <text
                    key={`${entity1.name}-${entity2.name}`}
                    x={midX}
                    y={entities.length === 3 ? midY + 20 : midY + 5}
                    textAnchor="middle"
                    className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
                    onClick={() => handlePairwiseClick(entity1.name, entity2.name)}
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
          <text
            x={width / 2}
            y={height / 2 + 5}
            textAnchor="middle"
            className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
            onClick={handleThreeWayClick}
          >
            {calculateThreeWayIntersection()}
          </text>
        )}
      </svg>
    </div>
  )
}

export default VennDiagramSVG
