// Input validation utilities
export function validateRequest(oem: string, country: string, contextData: any): void {
  if (!country || country.trim() === '') {
    throw new Error('Country is required for insight generation')
  }
  
  if (!contextData || typeof contextData !== 'object') {
    throw new Error('Context data is required for meaningful insights')
  }
}

export function validateContextData(contextData: any): void {
  const analysisType = contextData.analysisType;
  
  if (analysisType === 'landscape-analysis' && (!contextData.ranking || contextData.ranking.availableFeatures === 0)) {
    throw new Error('Invalid landscape analysis data - no features found')
  }
  
  if ((analysisType === 'business-model-analysis' || analysisType === 'category-analysis') && contextData.totalFeatures === 0) {
    throw new Error('Invalid analysis data - no features found')
  }
}

export function createFeedbackContext(contextData: any, oem: string, country: string) {
  return {
    selectedOEM: contextData.selectedOEM || oem,
    selectedCountry: contextData.selectedCountry || country,
    analysisType: contextData.analysisType || 'general'
  };
}