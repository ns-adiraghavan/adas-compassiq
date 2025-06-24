
import { VennDiagramData, EntityFeatureData } from "@/utils/vennDiagramUtils"
import { useTheme } from "@/contexts/ThemeContext"

interface VennDiagramStatsProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
}

const VennDiagramStats = ({ data, entities }: VennDiagramStatsProps) => {
  const { theme } = useTheme()

  const getOverlapPercentage = () => {
    if (entities.length < 2) return 0
    const sharedCount = data.sharedFeatures.length
    return data.totalFeatures > 0 ? ((sharedCount / data.totalFeatures) * 100).toFixed(1) : 0
  }

  return (
    <div className="flex gap-6">
      {/* Overview Box */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 ${theme.shadowColor} shadow-sm flex-1`}>
        <h3 className={`text-lg font-medium ${theme.textPrimary} mb-4`}>Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className={`text-sm ${theme.textSecondary}`}>Total Entities:</span>
            <span className={`text-sm font-medium ${theme.textPrimary}`}>{entities.length}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${theme.textSecondary}`}>Total Features:</span>
            <span className={`text-sm font-medium ${theme.textPrimary}`}>{data.totalFeatures}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${theme.textSecondary}`}>Shared Features:</span>
            <span className={`text-sm font-medium ${theme.textPrimary}`}>{data.sharedFeatures.length}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${theme.textSecondary}`}>Overlap Percentage:</span>
            <span className={`text-sm font-medium ${theme.textPrimary}`}>{getOverlapPercentage()}%</span>
          </div>
        </div>
      </div>

      {/* Most Common Features Box */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 ${theme.shadowColor} shadow-sm flex-1`}>
        <h3 className={`text-lg font-medium ${theme.textPrimary} mb-4`}>Most Common Features</h3>
        <div className="space-y-2">
          {data.mostCommonFeatures.slice(0, 5).map((feature, index) => (
            <div key={feature} className={`text-sm ${theme.textSecondary} truncate`} title={feature}>
              {index + 1}. {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VennDiagramStats
