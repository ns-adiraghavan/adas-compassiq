
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Loader2, AlertCircle } from "lucide-react"
import { useAIDataInsights } from "@/hooks/useAIDataInsights"
import { useTheme } from "@/contexts/ThemeContext"

interface DataSnippetsProps {
  selectedOEM: string
  selectedCountry: string
}

const DataSnippets = ({ selectedOEM, selectedCountry }: DataSnippetsProps) => {
  const { theme } = useTheme()
  const { data: aiInsights, isLoading, error } = useAIDataInsights({
    selectedOEM,
    selectedCountry,
    enabled: !!selectedOEM && !!selectedCountry
  })

  // Extract insights from AI response
  const insights = aiInsights?.analysis?.insights || []

  // Faster, more relevant fallback data based on context
  const contextualFallback = [
    {
      text: `${selectedOEM} market positioning analysis in progress`,
      context: "Processing competitive landscape data..."
    },
    {
      text: `Feature distribution trends for ${selectedCountry} being calculated`,
      context: "Analyzing regional preferences..."
    },
    {
      text: "Business model effectiveness assessment pending",
      context: "Evaluating revenue strategies..."
    },
    {
      text: "Technology adoption patterns being evaluated",
      context: "Measuring innovation impact..."
    },
    {
      text: "Market share insights generation in progress",
      context: "Calculating competitive metrics..."
    }
  ]

  const displayData = insights.length > 0 ? insights.slice(0, 5) : contextualFallback

  if (error) {
    return (
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Data Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border`}>
            <p className={`${theme.textMuted} text-xs`}>
              AI analysis temporarily unavailable. Showing contextual insights.
            </p>
          </div>
          {contextualFallback.slice(0, 3).map((insight, index) => (
            <div key={index} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border backdrop-blur-sm`}>
              <div className="flex items-start mb-1">
                <span className={`${theme.secondary} text-xs font-bold mr-2 mt-0.5`}>•</span>
                <p className={`${theme.textPrimary} text-xs font-medium leading-relaxed`}>
                  {insight.text}
                </p>
              </div>
              <p className={`${theme.textSecondary} text-xs ml-4`}>{insight.context}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
          <BarChart className="h-4 w-4 mr-2" />
          Data Insights
          {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {contextualFallback.map((insight, index) => (
              <div key={index} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border`}>
                <div className="flex items-start mb-1">
                  <span className={`${theme.secondary} text-xs font-bold mr-2 mt-0.5`}>•</span>
                  <p className={`${theme.textPrimary} text-xs font-medium leading-relaxed`}>
                    {insight.text}
                  </p>
                </div>
                <p className={`${theme.textSecondary} text-xs ml-4`}>{insight.context}</p>
              </div>
            ))}
          </div>
        ) : (
          displayData.map((insight, index) => (
            <div key={index} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border backdrop-blur-sm`}>
              <div className="flex items-start mb-1">
                <span className={`${theme.secondary} text-xs font-bold mr-2 mt-0.5`}>•</span>
                <p className={`${theme.textPrimary} text-xs font-medium leading-relaxed`}>
                  {insight.text || insight}
                </p>
              </div>
              {insight.context && (
                <p className={`${theme.textSecondary} text-xs ml-4`}>{insight.context}</p>
              )}
            </div>
          ))
        )}
        {selectedOEM && selectedCountry && (
          <div className={`text-xs ${theme.textMuted} text-center pt-2 border-t ${theme.cardBorder}`}>
            Analysis for {selectedOEM} in {selectedCountry}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DataSnippets
