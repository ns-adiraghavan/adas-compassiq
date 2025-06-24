
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Loader2, Lightbulb, TrendingUp, Grid } from "lucide-react"
import { useDataInsightsAI } from "@/hooks/useDataInsightsAI"

interface DataSnippetsProps {
  selectedOEM: string
  selectedCountry: string
  oemClickedFromChart?: boolean
  businessModelAnalysisContext?: any // Business model or category analysis context
}

const DataSnippets = ({ 
  selectedOEM, 
  selectedCountry, 
  oemClickedFromChart = false,
  businessModelAnalysisContext
}: DataSnippetsProps) => {
  // Only show OEM-specific insights if OEM was actually clicked from chart
  const showOEMInsights = oemClickedFromChart && selectedOEM && selectedOEM.trim() !== ""
  
  // Use business model or category analysis context if available, otherwise fall back to regular dashboard metrics
  const contextData = businessModelAnalysisContext || null
  
  const { data: aiInsights, isLoading, error } = useDataInsightsAI({
    selectedOEM: showOEMInsights ? selectedOEM : "",
    selectedCountry,
    enabled: true,
    contextData // Pass the analysis context
  })

  const getTitle = () => {
    if (businessModelAnalysisContext?.analysisType === 'business-model-analysis') {
      return "Business Model Strategic Insights"
    }
    if (businessModelAnalysisContext?.analysisType === 'category-analysis') {
      return "Category Strategic Insights"
    }
    if (showOEMInsights) {
      return `Strategic Insights - ${selectedOEM}`
    }
    return "Market Strategic Insights"
  }

  const getSubtitle = () => {
    if (businessModelAnalysisContext?.analysisType === 'business-model-analysis') {
      const { selectedOEMs, totalFeatures, selectedCountry: country } = businessModelAnalysisContext
      return `${selectedOEMs.join(', ')} • ${country} • ${totalFeatures} features analyzed`
    }
    if (businessModelAnalysisContext?.analysisType === 'category-analysis') {
      const { selectedOEMs, totalFeatures, selectedCountry: country, topCategories } = businessModelAnalysisContext
      return `${selectedOEMs.join(', ')} • ${country} • ${totalFeatures} features • ${topCategories.length} categories`
    }
    if (showOEMInsights) {
      return `${selectedOEM} • ${selectedCountry || 'Global'} • ${aiInsights?.dataPoints || 0} data points analyzed`
    }
    return `Market Overview • ${selectedCountry || 'Global'} • ${aiInsights?.dataPoints || 0} features analyzed`
  }

  const getIcon = () => {
    if (businessModelAnalysisContext?.analysisType === 'category-analysis') {
      return <Grid className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
    }
    if (businessModelAnalysisContext?.analysisType === 'business-model-analysis') {
      return <BarChart className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
    }
    if (showOEMInsights) {
      return <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
    }
    return <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
          <span className="text-white/60">
            {businessModelAnalysisContext?.analysisType === 'business-model-analysis' 
              ? 'Analyzing business model patterns...'
              : businessModelAnalysisContext?.analysisType === 'category-analysis'
                ? 'Analyzing category distribution...'
                : showOEMInsights 
                  ? 'Analyzing OEM performance...' 
                  : 'Analyzing market landscape...'
            }
          </span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="py-4">
          <p className="text-red-400 text-sm">Unable to generate insights</p>
          <p className="text-white/40 text-xs mt-1">Check data connectivity and try again</p>
        </div>
      )
    }

    if (!aiInsights?.insights?.length) {
      return (
        <div className="py-4">
          <p className="text-white/60 text-sm">No insights available for current selection</p>
          <p className="text-white/40 text-xs mt-1">
            {selectedCountry ? `No data found for ${selectedCountry}` : 'Select a country to view analysis'}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {aiInsights.insights.map((insight: string, index: number) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            {getIcon()}
            <p className="text-white text-sm leading-relaxed flex-1">
              {insight}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          {getTitle()}
        </CardTitle>
        <p className="text-white/60 text-xs">
          {getSubtitle()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default DataSnippets
