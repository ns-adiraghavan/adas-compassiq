
import { EntityFeatureData } from "@/utils/vennDiagramUtils"
import { useTheme } from "@/contexts/ThemeContext"

interface VennDiagramLegendProps {
  entities: EntityFeatureData[]
  colors: Array<{ fill: string; fillOpacity: string; stroke: string; label: string }>
}

const VennDiagramLegend = ({ entities, colors }: VennDiagramLegendProps) => {
  const { theme } = useTheme()

  return (
    <div className="absolute top-4 left-4">
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <h3 className={`text-sm font-medium ${theme.textPrimary} mb-3`}>Entities</h3>
        <div className="space-y-2">
          {entities.map((entity, index) => {
            const color = colors[index] || colors[0]
            return (
              <div key={entity.name} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: color.fill,
                    borderColor: color.stroke,
                    opacity: 0.8
                  }}
                />
                <span className={`text-sm ${theme.textSecondary}`}>
                  {entity.name}
                </span>
                <span className={`text-sm font-medium ${theme.textPrimary}`}>
                  ({entity.count})
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VennDiagramLegend
