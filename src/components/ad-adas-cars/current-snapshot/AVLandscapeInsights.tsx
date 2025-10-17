import { useTheme } from "@/contexts/ThemeContext"
import { Lightbulb } from "lucide-react"

const AVLandscapeInsights = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full`}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className={`h-5 w-5 ${theme.textPrimary}`} />
        <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>
          Insights on ADAS Tech of Top 5 OEMs
        </h3>
      </div>
      
      <div className={`space-y-4 ${theme.textSecondary}`}>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">
            Strategic insights on AV platform technologies across leading OEMs will appear here, providing:
          </p>
          <ul className="text-sm space-y-2 ml-4 list-disc">
            <li>Platform architecture analysis</li>
            <li>Autonomy level deployment patterns</li>
            <li>Driver intervention requirements</li>
            <li>Technology maturity assessment</li>
            <li>Competitive positioning insights</li>
          </ul>
        </div>
        
        <div className={`mt-6 p-4 rounded-lg ${theme.cardBackground} border ${theme.cardBorder}`}>
          <p className="text-xs italic">
            AI-generated insights will be populated based on selected filters and AV platform data analysis.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AVLandscapeInsights
