
import { EntityFeatureData } from "@/utils/vennDiagramUtils"
import { useTheme } from "@/contexts/ThemeContext"
import { CirclePosition } from "./types"
import { SVG_DIMENSIONS } from "./positioning"

interface VennCirclesProps {
  entities: EntityFeatureData[]
  positions: CirclePosition[]
  colors: Array<{ fill: string; fillOpacity: string; stroke: string; label: string }>
  onUniqueClick: (entityName: string) => void
}

const VennCircles = ({ entities, positions, colors, onUniqueClick }: VennCirclesProps) => {
  const { theme } = useTheme()

  return (
    <g>
      {entities.map((entity, index) => {
        const position = positions[index]
        const color = colors[index] || colors[0]
        
        return (
          <g key={entity.name}>
            <circle
              cx={position.cx}
              cy={position.cy}
              r={SVG_DIMENSIONS.radius}
              fill={color.fill}
              fillOpacity={color.fillOpacity}
              stroke={color.stroke}
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onUniqueClick(entity.name)}
            />
            
            <text
              x={position.cx}
              y={entities.length === 1 ? position.cy - SVG_DIMENSIONS.radius - 20 : position.cy - SVG_DIMENSIONS.radius - 10}
              textAnchor="middle"
              className={`text-sm font-medium ${theme.textPrimary} fill-current`}
            >
              {entity.name}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default VennCircles
