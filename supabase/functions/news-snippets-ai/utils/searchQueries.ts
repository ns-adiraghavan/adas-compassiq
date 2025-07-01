
export function buildSearchQuery(selectedOEMs: string[], selectedCountry: string, analysisType: string): string {
  // Start with simpler, more effective queries
  const primaryOEM = selectedOEMs.length > 0 ? selectedOEMs[0] : '';
  const countryFilter = selectedCountry ? ` ${selectedCountry}` : '';
  
  // Enhanced automotive terms with the requested focus areas
  const automotiveTerms = 'automotive OR car OR vehicle OR auto';
  const focusTerms = 'connected features OR launch OR introduction OR partnership OR technology OR update';
  
  switch (analysisType) {
    case 'landscape':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (${focusTerms} OR market OR competition OR sales)`;
      }
      return `${automotiveTerms}${countryFilter} (${focusTerms} OR market analysis)`;
    
    case 'category-analysis':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (${focusTerms} OR innovation OR features)`;
      }
      return `${automotiveTerms}${countryFilter} (${focusTerms} OR technology features)`;
    
    case 'business-model':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (${focusTerms} OR business OR revenue OR strategy)`;
      }
      return `${automotiveTerms}${countryFilter} (${focusTerms} OR business model)`;
    
    case 'vehicle-segment':
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (${focusTerms} OR SUV OR sedan OR electric OR EV)`;
      }
      return `${automotiveTerms}${countryFilter} (${focusTerms} OR vehicle segments)`;
    
    case 'general':
    default:
      if (primaryOEM) {
        return `${primaryOEM}${countryFilter} (${automotiveTerms}) (${focusTerms})`;
      }
      return `${automotiveTerms}${countryFilter} (${focusTerms} OR news)`;
  }
}
