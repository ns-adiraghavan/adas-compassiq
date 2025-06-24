
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
    // Use context data if available, otherwise fall back to dashboard metrics
    const analysisData = contextData || dashboardMetrics
    const analysisType = contextData ? "Business Model Analysis" : (selectedOEM ? selectedOEM : "Market Overview")
    const isMarketOverview = !selectedOEM || selectedOEM.trim() === ""
    
    console.log('Requesting Data Insights AI for:', { 
      selectedOEM: analysisType, 
      selectedCountry, 
      isMarketOverview,
      hasContextData: !!contextData,
      contextData: contextData ? 'Business Model Analysis Context' : 'Dashboard Metrics'
    })
    console.log('Using analysis data:', analysisData)
    
    const { data, error } = await supabase.functions.invoke('data-insights-ai', {
      body: {
        oem: analysisType,
        country: selectedCountry,
        dashboardMetrics: analysisData,
        isMarketOverview: isMarketOverview,
        analysisType: contextData ? "business-model-analysis" : "general",
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
