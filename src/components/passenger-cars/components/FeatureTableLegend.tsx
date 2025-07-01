import { Check } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

const FeatureTableLegend = () => {
  const { theme } = useTheme()

  return (
    <div className={`mt-4 p-3 ${theme.cardBackground} ${theme.cardBorder} border rounded-lg`}>
      <h5 className={`text-sm font-medium ${theme.textPrimary} mb-2`}>Legend</h5>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 border-2 border-green-500 rounded-full bg-transparent">
            <Check className="h-3 w-3 text-green-500 stroke-[3]" />
          </div>
          <span className={theme.textSecondary}>Lighthouse Feature (Premium)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className={theme.textSecondary}>Available Feature</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">-</span>
          <span className={theme.textSecondary}>Not Available</span>
        </div>
      </div>
    </div>
  )
}

export default FeatureTableLegend