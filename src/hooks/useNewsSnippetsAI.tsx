
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCallback } from "react"

interface NewsSnippet {
  id: number
  title: string
  summary: string
  source: string
  timestamp: string
  url: string
}

interface NewsSnippetsAIProps {
  selectedOEMs: string[]
  selectedCountry: string
  analysisType: string
  enabled?: boolean
}

interface NewsSnippetsResponse {
  success: boolean
  newsSnippets: NewsSnippet[]
  context?: any
  error?: string
}

export function useNewsSnippetsAI({ 
  selectedOEMs, 
  selectedCountry, 
  analysisType, 
  enabled = true 
}: NewsSnippetsAIProps) {
  
  const queryFn = useCallback(async (): Promise<NewsSnippetsResponse> => {
    console.log('Requesting OpenAI Contextual News for:', { 
      selectedOEMs, 
      selectedCountry, 
      analysisType 
    })
    
    const { data, error } = await supabase.functions.invoke('openai-contextual-news', {
      body: {
        selectedOEMs,
        selectedCountry,
        analysisType
      }
    })

    if (error) {
      console.error('OpenAI Contextual News error:', error)
      throw error
    }

    console.log('OpenAI Contextual News result:', data)
    return data as NewsSnippetsResponse
  }, [selectedOEMs, selectedCountry, analysisType])

  const shouldEnable = enabled && selectedCountry && analysisType

  return useQuery<NewsSnippetsResponse>({
    queryKey: [
      'openai-contextual-news', 
      selectedOEMs.join(',') || 'all', 
      selectedCountry, 
      analysisType
    ],
    queryFn: queryFn,
    enabled: Boolean(shouldEnable),
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes (fresh contextual content)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    retryDelay: 2000,
  })
}
