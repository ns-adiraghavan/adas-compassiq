
export function buildSearchQuery(selectedOEMs: string[], selectedCountry: string, analysisType: string): string {
  // Start with simpler, more effective queries
  const primaryOEM = selectedOEMs.length > 0 ? selectedOEMs[0] : '';
  const countryFilter = selectedCountry ? ` ${selectedCountry}` : '';
  
  // Base automotive terms for better matching
  const automotiveTerms = 'automotive OR car OR vehicle OR auto';
  
  switch (analysisType) {
    case 'landscape':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (market OR competition OR sales)`;
      }
      return `${automotiveTerms}${countryFilter} market analysis`;
    
    case 'category-analysis':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (technology OR features OR innovation)`;
      }
      return `${automotiveTerms}${countryFilter} technology features`;
    
    case 'business-model':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (business OR revenue OR strategy)`;
      }
      return `${automotiveTerms}${countryFilter} business model`;
    
    case 'vehicle-segment':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (SUV OR sedan OR electric OR EV)`;
      }
      return `${automotiveTerms}${countryFilter} vehicle segments`;
    
    case 'general':
    default:
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} ${automotiveTerms}`;
      }
      return `${automotiveTerms}${countryFilter} news`;
  }
}
