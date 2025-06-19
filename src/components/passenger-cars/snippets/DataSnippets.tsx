
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Loader2 } from "lucide-react"
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

  // Fallback mock data if AI fails
  const fallbackData = [
    {
      text: "Feature availability analysis in progress",
      context: "AI analysis loading..."
    },
    {
      text: "Market positioning insights pending",
      context: "Processing data..."
    },
    {
      text: "Competitive analysis being generated",
      context: "Please wait..."
    }
  ]

  const displayData = insights.length > 0 ? insights.slice(0, 5) : fallbackData

  return (
    <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm h-full flex flex-col`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
          <BarChart className="h-4 w-4 mr-2" />
          Data Insights
          {isLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border animate-pulse`}>
                  <div className={`h-3 ${theme.cardBackground} rounded mb-2`}></div>
                  <div className={`h-2 ${theme.cardBackground} rounded w-3/4`}></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border`}>
              <p className={`${theme.textMuted} text-xs`}>
                Unable to generate AI insights. Please try again later.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayData.map((insight, index) => (
                <div key={index} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border backdrop-blur-sm`}>
                  <div className="flex items-start mb-1">
                    <span className={`${theme.secondary} text-xs font-bold mr-2 mt-0.5 flex-shrink-0`}>•</span>
                    <p className={`${theme.textPrimary} text-xs font-medium leading-relaxed break-words`}>
                      {insight.text || insight}
                    </p>
                  </div>
                  {insight.context && (
                    <p className={`${theme.textSecondary} text-xs ml-4 break-words`}>{insight.context}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {selectedOEM && selectedCountry && (
            <div className={`text-xs ${theme.textMuted} text-center pt-2 border-t ${theme.cardBorder} mt-4`}>
              Analysis for {selectedOEM} in {selectedCountry}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DataSnippets
