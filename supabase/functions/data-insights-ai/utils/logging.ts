// Logging utilities
export function logRequestDetails(oem: string, country: string, analysisType: string, contextData: any): void {
  console.log('=== Data Insights AI Request ===')
  console.log('OEM:', oem)
  console.log('Country:', country) 
  console.log('Analysis Type:', analysisType)
  console.log('Context Data:', contextData ? 'Present' : 'Missing')
  console.log('Context Data Keys:', contextData ? Object.keys(contextData) : 'None')
}

export function logContextDataDetails(contextData: any): void {
  console.log('=== Context Data Details ===')
  console.log('Analysis Type:', contextData.analysisType)
  
  if (contextData.analysisType === 'landscape-analysis') {
    console.log('Landscape Data:', {
      selectedOEM: contextData.selectedOEM,
      ranking: contextData.ranking,
      topCategories: contextData.topCategories?.slice(0, 3),
      availableFeatures: contextData.ranking?.availableFeatures,
      lighthouseFeatures: contextData.ranking?.lighthouseFeatures
    })
  } else if (contextData.analysisType === 'business-model-analysis') {
    console.log('Business Model Data:', {
      selectedOEMs: contextData.selectedOEMs,
      totalFeatures: contextData.totalFeatures,
      businessModelComparison: contextData.businessModelComparison?.slice(0, 2)
    })
  } else if (contextData.analysisType === 'category-analysis') {
    console.log('Category Data:', {
      selectedOEMs: contextData.selectedOEMs,
      totalFeatures: contextData.totalFeatures,
      topCategories: contextData.topCategories?.slice(0, 3),
      categoryBreakdown: contextData.categoryBreakdown?.slice(0, 3)
    })
  } else {
    console.log('Other Analysis Data:', {
      selectedOEMs: contextData.selectedOEMs,
      selectedCountry: contextData.selectedCountry,
      totalFeatures: contextData.totalFeatures
    })
  }
}

export function logPromptDetails(prompt: string): void {
  console.log('Generated Prompt Length:', prompt.length)
  console.log('=== Prompt Preview ===')
  console.log(prompt.substring(0, 600) + '...')
}

export function logOpenAIResponse(data: any): void {
  console.log('=== OpenAI Response Analysis ===')
  console.log('Full OpenAI Response:', JSON.stringify(data, null, 2))
}