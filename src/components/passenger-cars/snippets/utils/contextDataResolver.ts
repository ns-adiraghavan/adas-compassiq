import { useMemo } from "react"
import { useLandscapeAnalysisData } from "@/hooks/useLandscapeAnalysisData"
import { ContextData } from "../types"

export function useContextDataResolver(
  businessModelAnalysisContext: any,
  selectedOEM: string,
  selectedCountry: string,
  location: any
): ContextData | null {
  const isLandscapePage = location.pathname.includes('/landscape')
  const shouldShowLandscapeInsights = isLandscapePage && selectedOEM && selectedCountry

  // Get landscape-specific analysis data when on landscape page
  const landscapeData = useLandscapeAnalysisData(
    shouldShowLandscapeInsights ? selectedOEM : "", 
    selectedCountry
  )

  return useMemo(() => {
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
}