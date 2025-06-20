
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCallback, useRef } from "react"

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
  
  const queryFn = useCallback(async (): Promise<DataInsightsResponse> => {
    console.log('Requesting Data Insights AI for:', { selectedOEM, selectedCountry })
    
    const { data, error } = await supabase.functions.invoke('data-insights-ai', {
      body: {
        oem: selectedOEM,
        country: selectedCountry,
      }
    })

    if (error) {
      console.error('Data Insights AI error:', error)
      throw error
    }

    console.log('Data Insights AI result:', data)
    return data as DataInsightsResponse
  }, [selectedOEM, selectedCountry])

  return useQuery<DataInsightsResponse>({
    queryKey: ['data-insights-ai', selectedOEM, selectedCountry],
    queryFn: queryFn,
    enabled: enabled && !!selectedOEM,
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000),
  })
}
