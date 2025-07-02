import { ContextData } from "../types"

export function getTitle(contextData?: ContextData): string {
  return "Strategic Insights"
}

export function getSubtitle(
  contextData: ContextData | null, 
  selectedCountry: string, 
  aiInsights: any
): string {
  if (!contextData) {
    return `Select data to view strategic insights • ${selectedCountry || 'Global'}`
  }
  
  const analysisType = contextData.analysisType
  
  switch (analysisType) {
    case 'landscape-analysis': {
      const data = contextData
      return `${data.selectedOEM} • ${data.selectedCountry} • Rank #${data.ranking?.rank} • ${data.ranking?.availableFeatures} features • ${data.ranking?.lighthouseFeatures} lighthouse`
    }
    case 'business-model-analysis': {
      const { selectedOEMs, totalFeatures, selectedCountry: country } = contextData
      return `${selectedOEMs?.join(', ')} • ${country} • ${totalFeatures} features analyzed`
    }
    case 'category-analysis': {
      const { selectedOEMs, totalFeatures, selectedCountry: country, topCategories } = contextData
      return `${selectedOEMs?.join(', ')} • ${country} • ${totalFeatures} features • ${topCategories?.length || 0} categories`
    }
    case 'vehicle-segment-analysis': {
      const oemsText = contextData.selectedOEMs?.length > 0 ? contextData.selectedOEMs.join(', ') : 'All OEMs'
      return `${oemsText} • ${contextData.selectedCountry} • Vehicle segment analysis • ${aiInsights?.dataPoints || 0} features`
    }
    case 'insights-analysis': {
      const oemsText = contextData.selectedOEMs?.length > 0 ? contextData.selectedOEMs.join(', ') : 'All OEMs'
      return `${oemsText} • ${contextData.selectedCountry} • Feature overlap analysis • ${aiInsights?.dataPoints || 0} features`
    }
    default:
      return `${selectedCountry || 'Global'} • ${aiInsights?.dataPoints || 0} features analyzed`
  }
}