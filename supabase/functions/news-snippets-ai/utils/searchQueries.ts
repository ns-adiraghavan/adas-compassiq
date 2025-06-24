
export function buildSearchQuery(selectedOEMs: string[], selectedCountry: string, analysisType: string): string {
  const baseOEMs = selectedOEMs.length > 0 ? selectedOEMs.slice(0, 3).join(' OR ') : 'automotive';
  
  switch (analysisType) {
    case 'landscape':
      return `(${baseOEMs}) AND (market share OR competitive landscape OR market position) AND ${selectedCountry} automotive`;
    
    case 'category-analysis':
      return `(${baseOEMs}) AND (features OR technology categories OR automotive innovation) AND ${selectedCountry}`;
    
    case 'business-model':
      return `(${baseOEMs}) AND (business model OR revenue model OR subscription OR partnership) AND ${selectedCountry} automotive`;
    
    case 'vehicle-segment':
      return `(${baseOEMs}) AND (vehicle segments OR SUV OR sedan OR electric vehicles) AND ${selectedCountry} automotive`;
    
    case 'general':
    default:
      return `(${baseOEMs}) AND automotive AND ${selectedCountry} AND (market OR industry OR news)`;
  }
}
