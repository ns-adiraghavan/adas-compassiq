
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCallback } from "react"

interface NewsSnippet {
  id: number
  title: string
  summary: string
  source: string
  timestamp: string
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
    console.log('Requesting News Snippets AI for:', { 
      selectedOEMs, 
      selectedCountry, 
      analysisType 
    })
    
    const { data, error } = await supabase.functions.invoke('news-snippets-ai', {
      body: {
        selectedOEMs,
        selectedCountry,
        analysisType
      }
    })

    if (error) {
      console.error('News Snippets AI error:', error)
      throw error
    }

    console.log('News Snippets AI result:', data)
    return data as NewsSnippetsResponse
  }, [selectedOEMs, selectedCountry, analysisType])

  const shouldEnable = enabled && selectedCountry && analysisType

  return useQuery<NewsSnippetsResponse>({
    queryKey: [
      'news-snippets-ai', 
      selectedOEMs.join(',') || 'all', 
      selectedCountry, 
      analysisType
    ],
    queryFn: queryFn,
    enabled: Boolean(shouldEnable),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes (news updates frequently)
    gcTime: 20 * 60 * 1000, // Keep in cache for 20 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
    retryDelay: 2000,
  })
}
