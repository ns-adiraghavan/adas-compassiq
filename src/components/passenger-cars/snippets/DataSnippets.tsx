
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

  // Show loading state with placeholder content
  if (isLoading) {
    return (
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
            <BarChart className="h-4 w-4 mr-2" />
            Data Insights
            <Loader2 className="h-3 w-3 ml-2 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`text-sm ${theme.textMuted} text-center py-4`}>
            Generating AI insights for {selectedOEM} in {selectedCountry}...
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
            <BarChart className="h-4 w-4 mr-2" />
            Data Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`text-sm ${theme.textMuted} text-center py-4`}>
            Unable to generate insights. Please try again later.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show placeholder when no OEM/Country selected
  if (!selectedOEM || !selectedCountry) {
    return (
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
            <BarChart className="h-4 w-4 mr-2" />
            Data Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`text-sm ${theme.textMuted} text-center py-4`}>
            Select an OEM to view AI-generated insights
          </div>
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length > 0 ? (
          insights.slice(0, 5).map((insight: any, index: number) => (
            <div key={index} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border backdrop-blur-sm`}>
              <div className="flex items-start">
                <span className={`${theme.secondary} text-xs font-bold mr-2 mt-0.5`}>•</span>
                <p className={`${theme.textPrimary} text-xs font-medium leading-relaxed`}>
                  {typeof insight === 'string' ? insight : insight.text || insight}
                </p>
              </div>
              {insight.context && (
                <p className={`${theme.textSecondary} text-xs mt-1 ml-4`}>{insight.context}</p>
              )}
            </div>
          ))
        ) : (
          <div className={`text-sm ${theme.textMuted} text-center py-4`}>
            No insights available for the current selection.
          </div>
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
