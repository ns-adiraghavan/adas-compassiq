
import EnhancedCategoryAnalysis from "./EnhancedCategoryAnalysis"

interface CategoryAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const CategoryAnalysis = ({ selectedOEM, selectedCountry }: CategoryAnalysisProps) => {
  return <EnhancedCategoryAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
}

export default CategoryAnalysis
