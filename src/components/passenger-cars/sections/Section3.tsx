
import { useTheme } from "@/contexts/ThemeContext"

const Section3 = () => {
  const { theme } = useTheme()

  return (
    <div className={`h-full flex items-center justify-center ${theme.backgroundGradient} transition-all duration-500`}>
      <div className="text-center max-w-2xl mx-auto px-8">
        <h2 className={`text-4xl font-light mb-6 ${theme.textPrimary} tracking-wide`}>
          Market Intelligence
        </h2>
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-2xl backdrop-blur-sm`}>
          <div className={`w-16 h-16 ${theme.primary} rounded-full mx-auto mb-6 flex items-center justify-center`}>
            <div className={`w-6 h-6 ${theme.secondary} rounded-sm rotate-45`}></div>
          </div>
          <p className={`${theme.textSecondary} text-lg mb-4 leading-relaxed`}>
            Real-time market analysis and competitive positioning insights
          </p>
          <p className={`${theme.textMuted} text-sm font-light`}>
            Monitor competitor strategies and identify emerging market opportunities
          </p>
          <div className={`mt-8 px-6 py-3 ${theme.accent} ${theme.textPrimary} rounded-full text-sm font-medium inline-block`}>
            In Development
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section3
