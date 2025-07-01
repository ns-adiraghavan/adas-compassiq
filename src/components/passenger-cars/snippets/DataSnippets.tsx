import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"
import { useDataInsightsAI } from "@/hooks/useDataInsightsAI"
import { useInsightFeedback } from "@/hooks/useInsightFeedback"
import { useLocation } from "react-router-dom"
import { DataSnippetsProps } from "./types"
import { useContextDataResolver } from "./utils/contextDataResolver"
import { getTitle, getSubtitle } from "./utils/titleUtils"
import { getIcon } from "./utils/iconUtils"
import { LoadingState } from "./components/LoadingState"
import { ErrorState } from "./components/ErrorState"
import { EmptyState } from "./components/EmptyState"
import { InsightsList } from "./components/InsightsList"

const DataSnippets = ({ 
  selectedOEM, 
  selectedCountry, 
  oemClickedFromChart = false,
  businessModelAnalysisContext
}: DataSnippetsProps) => {
  const location = useLocation()
  const isLandscapePage = location.pathname.includes('/landscape')
  const { submitFeedback, getFeedbackState, submittingFeedback } = useInsightFeedback()
  
  // Enhanced logic to show insights for various scenarios
  const shouldShowLandscapeInsights = Boolean(isLandscapePage && selectedOEM && selectedCountry)
  const showOEMInsights = Boolean(oemClickedFromChart || shouldShowLandscapeInsights)
  
  // Get context data using the resolver
  const contextData = useContextDataResolver(
    businessModelAnalysisContext,
    selectedOEM,
    selectedCountry,
    location
  )
  
  const { data: aiInsights, isLoading, error } = useDataInsightsAI({
    selectedOEM: contextData ? (contextData.selectedOEM || selectedOEM) : "",
    selectedCountry,
    enabled: Boolean(contextData && selectedCountry), // Only enable when we have valid context
    contextData // Pass the validated analysis context
  })

  const handleFeedback = (insight: string, feedbackType: 'like' | 'dislike') => {
    submitFeedback(insight, feedbackType, {
      selectedOEM: contextData?.selectedOEM || selectedOEM,
      selectedCountry: contextData?.selectedCountry || selectedCountry,
      analysisType: contextData?.analysisType || 'general'
    })
  }

  const iconComponent = () => getIcon(contextData, businessModelAnalysisContext, showOEMInsights)

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState contextData={contextData} showOEMInsights={showOEMInsights} />
    }
    
    if (!contextData) {
      return <EmptyState contextData={contextData} selectedCountry={selectedCountry} />
    }

    if (error) {
      return <ErrorState />
    }

    if (!aiInsights?.insights?.length) {
      return <EmptyState contextData={contextData} selectedCountry={selectedCountry} />
    }

    return (
      <InsightsList
        insights={aiInsights.insights}
        contextData={contextData}
        selectedOEM={selectedOEM}
        selectedCountry={selectedCountry}
        onFeedback={handleFeedback}
        getFeedbackState={getFeedbackState}
        submittingFeedback={Boolean(submittingFeedback)}
        getIcon={iconComponent}
      />
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          {getTitle(contextData)}
        </CardTitle>
        <p className="text-white/60 text-xs">
          {getSubtitle(contextData, selectedCountry, aiInsights)}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default DataSnippets
