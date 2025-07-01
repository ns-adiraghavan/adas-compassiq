import { useMemo } from "react"
import { useVennDiagramData } from "./useVennDiagramData"

interface InsightsContextData {
  analysisType: 'insights-analysis'
  selectedOEMs: string[]
  selectedCountry: string
  totalFeatures: number
  featureOverlaps: {
    uniqueFeatures: Record<string, number>
    sharedFeatures: number
    totalIntersections: number
  }
}

export function useInsightsContext(
  selectedOEMs: string[], 
  selectedCountry: string
): InsightsContextData | null {
  const { vennData, isLoading } = useVennDiagramData(selectedCountry, selectedOEMs)

  return useMemo(() => {
    if (isLoading || !vennData || !selectedCountry || selectedOEMs.length === 0) {
      return null
    }

    console.log('Processing insights context for:', selectedOEMs, selectedCountry)

    // Calculate feature overlaps from Venn diagram data
    const uniqueFeatures: Record<string, number> = {}
    let sharedFeatures = 0
    let totalIntersections = 0
    let totalFeatures = 0

    // Calculate totals from available venn data
    selectedOEMs.forEach(oem => {
      uniqueFeatures[oem] = 10 // Placeholder - will be calculated properly in edge function
      totalFeatures += 10
    })
    
    sharedFeatures = 5 // Placeholder - will be calculated properly in edge function
    totalIntersections = selectedOEMs.length > 1 ? 1 : 0

    const result: InsightsContextData = {
      analysisType: 'insights-analysis',
      selectedOEMs,
      selectedCountry,
      totalFeatures,
      featureOverlaps: {
        uniqueFeatures,
        sharedFeatures,
        totalIntersections
      }
    }

    console.log('Insights context:', result)
    return result
  }, [vennData, isLoading, selectedOEMs, selectedCountry])
}