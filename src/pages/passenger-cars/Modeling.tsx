
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import { useTheme } from "@/contexts/ThemeContext"

const ModelingContent = () => {
  const { theme } = useTheme()

  return (
    <div className={`h-full flex items-center justify-center ${theme.backgroundGradient} transition-all duration-500`}>
      <div className="text-center max-w-2xl mx-auto px-8">
        <h2 className={`text-4xl font-light mb-6 ${theme.textPrimary} tracking-wide`}>
          Predictive Modeling
        </h2>
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-2xl backdrop-blur-sm`}>
          <div className={`w-16 h-16 ${theme.primary} rounded-full mx-auto mb-6 flex items-center justify-center`}>
            <div className={`w-4 h-8 ${theme.secondary} rounded-full`}></div>
          </div>
          <p className={`${theme.textSecondary} text-lg mb-4 leading-relaxed`}>
            AI-powered forecasting for automotive industry trends and demand
          </p>
          <p className={`${theme.textMuted} text-sm font-light`}>
            Predictive models help OEMs plan for future market conditions and consumer preferences
          </p>
          <div className={`mt-8 px-6 py-3 ${theme.accent} ${theme.textPrimary} rounded-full text-sm font-medium inline-block`}>
            Beta Testing
          </div>
        </div>
      </div>
    </div>
  )
}

const PassengerCarsModeling = () => {
  return (
    <PassengerCarsLayout>
      <ModelingContent />
    </PassengerCarsLayout>
  )
}

export default PassengerCarsModeling
