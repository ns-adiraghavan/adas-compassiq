
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import { useTheme } from "@/contexts/ThemeContext"

const AnalyticsContent = () => {
  const { theme } = useTheme()

  return (
    <div className={`h-full flex items-center justify-center ${theme.backgroundGradient} transition-all duration-500`}>
      <div className="text-center max-w-2xl mx-auto px-8">
        <h2 className={`text-4xl font-light mb-6 ${theme.textPrimary} tracking-wide`}>
          Advanced Analytics
        </h2>
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-2xl backdrop-blur-sm`}>
          <div className={`w-16 h-16 ${theme.primary} rounded-full mx-auto mb-6 flex items-center justify-center`}>
            <div className={`w-8 h-8 ${theme.secondary} rounded-full`}></div>
          </div>
          <p className={`${theme.textSecondary} text-lg mb-4 leading-relaxed`}>
            Deep insights into automotive market trends and consumer behavior patterns
          </p>
          <p className={`${theme.textMuted} text-sm font-light`}>
            Advanced machine learning algorithms analyze vast datasets to provide actionable intelligence
          </p>
          <div className={`mt-8 px-6 py-3 ${theme.accent} ${theme.textPrimary} rounded-full text-sm font-medium inline-block`}>
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  )
}

const PassengerCarsAnalytics = () => {
  return (
    <PassengerCarsLayout>
      <AnalyticsContent />
    </PassengerCarsLayout>
  )
}

export default PassengerCarsAnalytics
