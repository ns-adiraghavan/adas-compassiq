import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Loader2, Lightbulb, TrendingUp, Grid, ThumbsUp, ThumbsDown } from "lucide-react"
import { useDataInsightsAI } from "@/hooks/useDataInsightsAI"
import { useLandscapeAnalysisData } from "@/hooks/useLandscapeAnalysisData"
import { useInsightFeedback } from "@/hooks/useInsightFeedback"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"

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
  const location = useLocation()
  const isLandscapePage = location.pathname.includes('/landscape')
  const { submitFeedback, getFeedbackState, submittingFeedback } = useInsightFeedback()
  
  // Enhanced logic to show insights for various scenarios
  const shouldShowLandscapeInsights = isLandscapePage && selectedOEM && selectedCountry
  const showOEMInsights = oemClickedFromChart || shouldShowLandscapeInsights
  
  // Get landscape-specific analysis data when on landscape page
  const landscapeData = useLandscapeAnalysisData(
    shouldShowLandscapeInsights ? selectedOEM : "", 
    selectedCountry
  )
  
  // Enhanced context data selection with validation
  const contextData = useMemo(() => {
    // Priority 1: Business Model Analysis Context (already validated in parent)
    if (businessModelAnalysisContext && businessModelAnalysisContext.totalFeatures > 0) {
      console.log('Using Business Model Analysis context:', businessModelAnalysisContext)
      return {
        ...businessModelAnalysisContext,
        analysisType: businessModelAnalysisContext.analysisType || 'business-model-analysis'
      }
    }
    
    // Priority 2: Landscape Analysis Context (validate data quality)
    if (isLandscapePage && landscapeData && landscapeData.ranking.availableFeatures > 0) {
      console.log('Using Landscape Analysis context:', landscapeData)
      return {
        analysisType: 'landscape-analysis',
        ...landscapeData
      }
    }
    
    // Priority 3: Vehicle Segment Analysis Context
    if (location.pathname.includes('/intelligence') && selectedCountry) {
      console.log('Creating Vehicle Segment Analysis context')
      return {
        analysisType: 'vehicle-segment-analysis',
        selectedCountry,
        selectedOEMs: Array.isArray(selectedOEM) ? selectedOEM : [selectedOEM].filter(Boolean),
        totalFeatures: 0 // Will be calculated in edge function
      }
    }
    
    // Priority 4: Insights/Venn Diagram Context
    if (location.pathname.includes('/insights') && selectedCountry) {
      console.log('Creating Insights Analysis context')
      return {
        analysisType: 'insights-analysis',
        selectedCountry,
        selectedOEMs: Array.isArray(selectedOEM) ? selectedOEM : [selectedOEM].filter(Boolean),
        totalFeatures: 0 // Will be calculated in edge function
      }
    }
    
    console.log('No valid context data found')
    return null
  }, [businessModelAnalysisContext, landscapeData, isLandscapePage, selectedOEM, selectedCountry, location.pathname])
  
  const { data: aiInsights, isLoading, error } = useDataInsightsAI({
    selectedOEM: contextData ? (contextData.selectedOEM || selectedOEM) : "",
    selectedCountry,
    enabled: Boolean(contextData && selectedCountry), // Only enable when we have valid context
    contextData // Pass the validated analysis context
  })

  const getTitle = () => {
    const analysisType = contextData?.analysisType
    switch (analysisType) {
      case 'landscape-analysis': return "Landscape Strategic Insights"
      case 'business-model-analysis': return "Business Model Strategic Insights"
      case 'category-analysis': return "Category Strategic Insights"
      case 'vehicle-segment-analysis': return "Vehicle Segment Strategic Insights"
      case 'insights-analysis': return "Feature Overlap Strategic Insights"
      default: return "Strategic Insights"
    }
  }

  const getSubtitle = () => {
    if (!contextData) {
      return `Select data to view strategic insights • ${selectedCountry || 'Global'}`
    }
    
    const analysisType = contextData.analysisType
    
    switch (analysisType) {
      case 'landscape-analysis': {
        const data = contextData
        return `${data.selectedOEM} • ${data.selectedCountry} • Rank #${data.ranking?.rank} • ${data.ranking?.availableFeatures} features • ${data.ranking?.lighthouseFeatures} lighthouse`
      }
      case 'business-model-analysis': {
        const { selectedOEMs, totalFeatures, selectedCountry: country } = contextData
        return `${selectedOEMs?.join(', ')} • ${country} • ${totalFeatures} features analyzed`
      }
      case 'category-analysis': {
        const { selectedOEMs, totalFeatures, selectedCountry: country, topCategories } = contextData
        return `${selectedOEMs?.join(', ')} • ${country} • ${totalFeatures} features • ${topCategories?.length || 0} categories`
      }
      case 'vehicle-segment-analysis': {
        const oemsText = contextData.selectedOEMs?.length > 0 ? contextData.selectedOEMs.join(', ') : 'All OEMs'
        return `${oemsText} • ${contextData.selectedCountry} • Vehicle segment analysis • ${aiInsights?.dataPoints || 0} features`
      }
      case 'insights-analysis': {
        const oemsText = contextData.selectedOEMs?.length > 0 ? contextData.selectedOEMs.join(', ') : 'All OEMs'
        return `${oemsText} • ${contextData.selectedCountry} • Feature overlap analysis • ${aiInsights?.dataPoints || 0} features`
      }
      default:
        return `${selectedCountry || 'Global'} • ${aiInsights?.dataPoints || 0} features analyzed`
    }
  }

  const getIcon = () => {
    if (contextData?.analysisType === 'landscape-analysis') {
      return <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
    }
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
      const analysisType = contextData?.analysisType
      let loadingText = 'Analyzing data...'
      
      switch (analysisType) {
        case 'landscape-analysis': loadingText = 'Analyzing landscape positioning...'; break
        case 'business-model-analysis': loadingText = 'Analyzing business model patterns...'; break
        case 'category-analysis': loadingText = 'Analyzing category distribution...'; break
        case 'vehicle-segment-analysis': loadingText = 'Analyzing vehicle segment data...'; break
        case 'insights-analysis': loadingText = 'Analyzing feature overlaps...'; break
        default: loadingText = showOEMInsights ? 'Analyzing OEM performance...' : 'Analyzing market landscape...'
      }
      
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
          <span className="text-white/60">{loadingText}</span>
        </div>
      )
    }
    
    if (!contextData) {
      return (
        <div className="py-4">
          <p className="text-white/60 text-sm">No analysis context available</p>
          <p className="text-white/40 text-xs mt-1">
            Select OEMs and ensure data is loaded to view strategic insights
          </p>
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
      const analysisType = contextData?.analysisType
      let noDataText = 'No insights available for current selection'
      let helpText = selectedCountry ? `No data found for ${selectedCountry}` : 'Select a country to view analysis'
      
      switch (analysisType) {
        case 'landscape-analysis':
          noDataText = 'No landscape insights available'
          helpText = 'Ensure OEM is selected and data is available'
          break
        case 'business-model-analysis':
          noDataText = 'No business model insights available'
          helpText = 'Select OEMs to analyze business model patterns'
          break
        case 'category-analysis':
          noDataText = 'No category insights available'
          helpText = 'Select OEMs to analyze category distribution'
          break
        case 'vehicle-segment-analysis':
          noDataText = 'No vehicle segment insights available'
          helpText = 'Select OEMs and country for segment analysis'
          break
        case 'insights-analysis':
          noDataText = 'No feature overlap insights available'
          helpText = 'Select multiple OEMs to analyze feature overlaps'
          break
      }
      
      return (
        <div className="py-4">
          <p className="text-white/60 text-sm">{noDataText}</p>
          <p className="text-white/40 text-xs mt-1">{helpText}</p>
        </div>
      )
    }

    const handleFeedback = (insight: string, feedbackType: 'like' | 'dislike') => {
      submitFeedback(insight, feedbackType, {
        selectedOEM: contextData?.selectedOEM || selectedOEM,
        selectedCountry: contextData?.selectedCountry || selectedCountry,
        analysisType: contextData?.analysisType || 'general'
      })
    }

    return (
      <div className="space-y-3">
        {aiInsights.insights.map((insight: string, index: number) => {
          const feedbackState = getFeedbackState(insight, {
            selectedOEM: contextData?.selectedOEM || selectedOEM,
            selectedCountry: contextData?.selectedCountry || selectedCountry,
            analysisType: contextData?.analysisType || 'general'
          })
          
          return (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
              {getIcon()}
              <p className="text-white text-sm leading-relaxed flex-1">
                {insight}
              </p>
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-green-500/20 ${
                    feedbackState === 'like' 
                      ? 'bg-green-500/30 text-green-400' 
                      : 'text-gray-400 hover:text-green-400'
                  }`}
                  onClick={() => handleFeedback(insight, 'like')}
                  disabled={submittingFeedback !== null}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 hover:bg-red-500/20 ${
                    feedbackState === 'dislike' 
                      ? 'bg-red-500/30 text-red-400' 
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                  onClick={() => handleFeedback(insight, 'dislike')}
                  disabled={submittingFeedback !== null}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )
        })}
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
