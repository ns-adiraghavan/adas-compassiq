
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useCallback, useRef } from "react"

interface AIAnalysisProps {
  selectedOEM: string
  selectedCountry: string
  analysisType: string
  enabled?: boolean
}

// Cache for storing filtered data to avoid repeated processing
const dataCache = new Map<string, any>()

// Debounce helper
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
}

export function useAIAnalysis({ selectedOEM, selectedCountry, analysisType, enabled = true }: AIAnalysisProps) {
  // Create cache key for this specific combination
  const cacheKey = `${selectedOEM}-${selectedCountry}-${analysisType}`
  
  // Debounced query function to prevent rapid API calls
  const debouncedQuery = useDebounce(async () => {
    console.log('Requesting AI analysis for:', { selectedOEM, selectedCountry, analysisType })
    
    // Check if we have cached data first
    if (dataCache.has(cacheKey)) {
      console.log('Using cached analysis data for:', cacheKey)
      return dataCache.get(cacheKey)
    }
    
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
    
    // Cache the result for future use
    dataCache.set(cacheKey, data)
    
    return data
  }, 300)

  return useQuery({
    queryKey: ['ai-analysis', selectedOEM, selectedCountry, analysisType],
    queryFn: debouncedQuery,
    enabled: enabled && !!selectedOEM,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes since data is static
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchOnWindowFocus: false, // Don't refetch on window focus for static data
    refetchOnReconnect: false, // Don't refetch on reconnect for static data
    retry: (failureCount, error) => {
      // Implement exponential backoff retry
      if (failureCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, failureCount), 10000)
        console.log(`Retrying AI analysis in ${delay}ms (attempt ${failureCount + 1})`)
        return true
      }
      return false
    },
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  })
}
