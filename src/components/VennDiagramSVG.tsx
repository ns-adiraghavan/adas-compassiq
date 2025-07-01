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

  // Calculate proper intersection positions for 3-circle Venn diagram
  const getIntersectionPositions = () => {
    if (entities.length === 3) {
      const [pos1, pos2, pos3] = positions
      return {
        // Two-way intersections (excluding center overlap)
        [`${entities[0].name}-${entities[1].name}`]: {
          x: (pos1.cx + pos2.cx) / 2 - 25,
          y: (pos1.cy + pos2.cy) / 2 - 15
        },
        [`${entities[0].name}-${entities[2].name}`]: {
          x: (pos1.cx + pos3.cx) / 2 + 25,
          y: (pos1.cy + pos3.cy) / 2 - 15
        },
        [`${entities[1].name}-${entities[2].name}`]: {
          x: (pos2.cx + pos3.cx) / 2,
          y: (pos2.cy + pos3.cy) / 2 + 35
        },
        // Three-way intersection (center)
        'all': {
          x: width / 2,
          y: height / 2 + 5
        }
      }
    } else if (entities.length === 2) {
      const [pos1, pos2] = positions
      return {
        [`${entities[0].name}-${entities[1].name}`]: {
          x: (pos1.cx + pos2.cx) / 2,
          y: (pos1.cy + pos2.cy) / 2 + 5
        }
      }
    }
    return {}
  }

  const intersectionPositions = getIntersectionPositions()

  // Calculate unique feature positions (outside intersections)
  const getUniquePositions = () => {
    if (entities.length === 3) {
      const [pos1, pos2, pos3] = positions
      return {
        [entities[0].name]: { x: pos1.cx, y: pos1.cy - 60 },
        [entities[1].name]: { x: pos2.cx - 50, y: pos2.cy + 30 },
        [entities[2].name]: { x: pos3.cx + 50, y: pos3.cy + 30 }
      }
    } else if (entities.length === 2) {
      const [pos1, pos2] = positions
      return {
        [entities[0].name]: { x: pos1.cx - 40, y: pos1.cy },
        [entities[1].name]: { x: pos2.cx + 40, y: pos2.cy }
      }
    } else if (entities.length === 1) {
      return {
        [entities[0].name]: { x: positions[0].cx, y: positions[0].cy + 5 }
      }
    }
    return {}
  }

  const uniquePositions = getUniquePositions()

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
            </g>
          )
        })}

        {/* Unique counts positioned outside intersections */}
        {entities.map((entity) => {
          const uniquePos = uniquePositions[entity.name]
          const count = calculateUniqueCount(entity.name)
          
          if (!uniquePos || count === 0) return null
          
          return (
            <text
              key={`unique-${entity.name}`}
              x={uniquePos.x}
              y={uniquePos.y}
              textAnchor="middle"
              className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
              onClick={() => handleUniqueClick(entity.name)}
            >
              {count}
            </text>
          )
        })}

        {/* Two-way intersections */}
        {entities.length >= 2 && (
          <>
            {entities.map((entity1, i) => 
              entities.slice(i + 1).map((entity2, j) => {
                const actualJ = i + 1 + j
                const key = `${entity1.name}-${entity2.name}`
                const reverseKey = `${entity2.name}-${entity1.name}`
                const intersectionPos = intersectionPositions[key] || intersectionPositions[reverseKey]
                const count = calculateTwoWayIntersection(entity1.name, entity2.name)
                
                if (!intersectionPos || count === 0) return null
                
                return (
                  <text
                    key={key}
                    x={intersectionPos.x}
                    y={intersectionPos.y}
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

        {/* Three-way intersection (center) */}
        {entities.length === 3 && (
          (() => {
            const centerPos = intersectionPositions['all']
            const count = calculateThreeWayIntersection()
            
            if (!centerPos || count === 0) return null
            
            return (
              <text
                x={centerPos.x}
                y={centerPos.y}
                textAnchor="middle"
                className={`text-lg font-semibold ${theme.textPrimary} fill-current cursor-pointer hover:opacity-80`}
                onClick={handleThreeWayClick}
              >
                {count}
              </text>
            )
          })()
        )}
      </svg>
    </div>
  )
}

export default VennDiagramSVG
