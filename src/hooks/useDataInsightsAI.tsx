
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCallback } from "react"
import { useDashboardMetrics } from "./useDashboardMetrics"

interface DataInsightsAIProps {
  selectedOEM: string
  selectedCountry: string
  enabled?: boolean
}

interface DataInsightsResponse {
  success: boolean
  insights: string[]
  dataPoints: number
  cached?: boolean
}

export function useDataInsightsAI({ selectedOEM, selectedCountry, enabled = true }: DataInsightsAIProps) {
  // Use the same data processing logic from the Landscape page
  const { dashboardMetrics, isLoading: isMetricsLoading } = useDashboardMetrics(selectedOEM, selectedCountry)
  
  const queryFn = useCallback(async (): Promise<DataInsightsResponse> => {
    // Determine if this is market overview or OEM-specific analysis
    const isMarketOverview = !selectedOEM || selectedOEM.trim() === ""
    const analysisType = isMarketOverview ? "Market Overview" : selectedOEM
    
    console.log('Requesting Data Insights AI for:', { 
      selectedOEM: analysisType, 
      selectedCountry, 
      isMarketOverview 
    })
    console.log('Using dashboard metrics:', dashboardMetrics)
    
    const { data, error } = await supabase.functions.invoke('data-insights-ai', {
      body: {
        oem: analysisType,
        country: selectedCountry,
        dashboardMetrics: dashboardMetrics,
        isMarketOverview: isMarketOverview
      }
    })

    if (error) {
      console.error('Data Insights AI error:', error)
      throw error
    }

    console.log('Data Insights AI result:', data)
    return data as DataInsightsResponse
  }, [selectedOEM, selectedCountry, dashboardMetrics])

  return useQuery<DataInsightsResponse>({
    queryKey: ['data-insights-ai', selectedOEM || 'market-overview', selectedCountry, dashboardMetrics],
    queryFn: queryFn,
    enabled: enabled && !isMetricsLoading && !!dashboardMetrics,
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000),
  })
}
