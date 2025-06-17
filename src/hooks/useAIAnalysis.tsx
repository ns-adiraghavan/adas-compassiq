
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AIAnalysisProps {
  selectedOEM: string
  selectedCountry: string
  analysisType: string
  enabled?: boolean
}

export function useAIAnalysis({ selectedOEM, selectedCountry, analysisType, enabled = true }: AIAnalysisProps) {
  return useQuery({
    queryKey: ['ai-analysis', selectedOEM, selectedCountry, analysisType],
    queryFn: async () => {
      console.log('Requesting AI analysis for:', { selectedOEM, selectedCountry, analysisType })
      
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: {
          oem: selectedOEM,
          country: selectedCountry,
          analysisType,
        }
      })

      if (error) {
        console.error('AI Analysis error:', error)
        throw error
      }

      console.log('AI Analysis result:', data)
      return data
    },
    enabled: enabled && !!selectedOEM,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}
