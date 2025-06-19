
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AIDataInsightsProps {
  selectedOEM: string
  selectedCountry: string
  enabled?: boolean
}

export function useAIDataInsights({ selectedOEM, selectedCountry, enabled = true }: AIDataInsightsProps) {
  return useQuery({
    queryKey: ['ai-data-insights', selectedOEM, selectedCountry],
    queryFn: async () => {
      console.log('Requesting AI data insights for:', { selectedOEM, selectedCountry })
      
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: {
          oem: selectedOEM,
          country: selectedCountry,
          analysisType: 'insights',
        }
      })

      if (error) {
        console.error('AI Data Insights error:', error)
        throw error
      }

      console.log('AI Data Insights result:', data)
      return data
    },
    enabled: enabled && !!selectedOEM && !!selectedCountry,
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes (increased from 10)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 1, // Reduce retries to fail faster
    retryDelay: 1000, // Quick retry delay
  })
}
