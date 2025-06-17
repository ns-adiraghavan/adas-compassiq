
import EnhancedFeatureAnalysis from "./EnhancedFeatureAnalysis"

interface FeatureAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const FeatureAnalysis = ({ selectedOEM, selectedCountry }: FeatureAnalysisProps) => {
  return <EnhancedFeatureAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
}

export default FeatureAnalysis
