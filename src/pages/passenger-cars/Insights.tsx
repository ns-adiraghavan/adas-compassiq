
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import { useTheme } from "@/contexts/ThemeContext"

const InsightsContent = () => {
  const { theme } = useTheme()

  return (
    <div className={`h-full flex items-center justify-center ${theme.backgroundGradient} transition-all duration-500`}>
      <div className="text-center max-w-2xl mx-auto px-8">
        <h2 className={`text-4xl font-light mb-6 ${theme.textPrimary} tracking-wide`}>
          Strategic Insights
        </h2>
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-2xl backdrop-blur-sm`}>
          <div className={`w-16 h-16 ${theme.primary} rounded-full mx-auto mb-6 flex items-center justify-center`}>
            <div className={`w-10 h-2 ${theme.secondary} rounded-full`}></div>
          </div>
          <p className={`${theme.textSecondary} text-lg mb-4 leading-relaxed`}>
            Executive-level strategic recommendations and industry outlook
          </p>
          <p className={`${theme.textMuted} text-sm font-light`}>
            Comprehensive reports and actionable insights for C-suite decision making
          </p>
          <div className={`mt-8 px-6 py-3 ${theme.accent} ${theme.textPrimary} rounded-full text-sm font-medium inline-block`}>
            Planning Phase
          </div>
        </div>
      </div>
    </div>
  )
}

const PassengerCarsInsights = () => {
  return (
    <PassengerCarsLayout>
      <InsightsContent />
    </PassengerCarsLayout>
  )
}

export default PassengerCarsInsights
