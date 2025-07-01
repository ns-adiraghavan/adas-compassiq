
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCallback } from "react"
import { useDashboardMetrics } from "./useDashboardMetrics"

interface DataInsightsAIProps {
  selectedOEM: string
  selectedCountry: string
  enabled?: boolean
  contextData?: any // New prop for page-specific context data
}

interface DataInsightsResponse {
  success: boolean
  insights: string[]
  dataPoints: number
  cached?: boolean
}

export function useDataInsightsAI({ 
  selectedOEM, 
  selectedCountry, 
  enabled = true, 
  contextData 
}: DataInsightsAIProps) {
  // Use the same data processing logic from the Landscape page as fallback
  const { dashboardMetrics, isLoading: isMetricsLoading } = useDashboardMetrics(selectedOEM, selectedCountry)
  
  const queryFn = useCallback(async (): Promise<DataInsightsResponse> => {
    // Enhanced validation and data preparation
    if (!contextData) {
      throw new Error('Context data is required for meaningful insights')
    }
    
    const analysisType = contextData.analysisType || 'general'
    const actualSelectedOEM = contextData.selectedOEM || selectedOEM || ""
    const actualSelectedCountry = contextData.selectedCountry || selectedCountry
    const isMarketOverview = !actualSelectedOEM || actualSelectedOEM.trim() === ""
    
    console.log('Requesting Data Insights AI for:', { 
      selectedOEM: actualSelectedOEM, 
      selectedCountry: actualSelectedCountry, 
      analysisType,
      isMarketOverview,
      hasContextData: true,
      contextDataType: analysisType
    })
    
    // Validate context data quality
    if (analysisType === 'landscape-analysis' && (!contextData.ranking || contextData.ranking.availableFeatures === 0)) {
      throw new Error('Invalid landscape analysis data - no features found')
    }
    
    if ((analysisType === 'business-model-analysis' || analysisType === 'category-analysis') && contextData.totalFeatures === 0) {
      throw new Error('Invalid analysis data - no features found')
    }
    
    console.log('Using validated context data:', {
      analysisType,
      totalFeatures: contextData.totalFeatures || contextData.ranking?.availableFeatures || 0,
      hasValidData: true
    })
    
    const { data, error } = await supabase.functions.invoke('data-insights-ai', {
      body: {
        oem: actualSelectedOEM,
        country: actualSelectedCountry,
        dashboardMetrics: dashboardMetrics || {},
        isMarketOverview: isMarketOverview,
        analysisType: analysisType,
        contextData: contextData
      }
    })

    if (error) {
      console.error('Data Insights AI error:', error)
      throw error
    }

    console.log('Data Insights AI result:', data)
    return data as DataInsightsResponse
  }, [selectedOEM, selectedCountry, dashboardMetrics, contextData])

  // Fix the enabled logic to ensure it always returns a boolean
  const shouldEnable = enabled && (
    contextData ? true : (!isMetricsLoading && !!dashboardMetrics)
  )

  return useQuery<DataInsightsResponse>({
    queryKey: [
      'data-insights-ai', 
      selectedOEM || 'market-overview', 
      selectedCountry, 
      contextData ? 'business-model-context' : 'dashboard-metrics',
      contextData || dashboardMetrics
    ],
    queryFn: queryFn,
    enabled: Boolean(shouldEnable),
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000),
  })
}
