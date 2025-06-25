
import { useTheme } from "@/contexts/ThemeContext"
import { useCategoryAnalysisData } from "./hooks/useCategoryAnalysisData"
import CategorySummaryTable from "./components/CategorySummaryTable"
import ExpandedFeaturesTable from "./components/ExpandedFeaturesTable"

interface CategoryAnalysisTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  businessModelFilter?: string
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
  showBusinessModelInDetails?: boolean
}

const CategoryAnalysisTable = ({ 
  selectedCountry, 
  selectedOEMs, 
  businessModelFilter,
  expandedCategory, 
  onCategoryClick,
  showBusinessModelInDetails = false
}: CategoryAnalysisTableProps) => {
  const { theme } = useTheme()
  
  const { categoryData, expandedFeaturesData } = useCategoryAnalysisData({
    selectedCountry,
    selectedOEMs,
    businessModelFilter,
    expandedCategory,
    showBusinessModelInDetails
  })

  if (categoryData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className={`${theme.textMuted}`}>No data available for selected filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Summary Table */}
      <CategorySummaryTable
        categoryData={categoryData}
        selectedOEMs={selectedOEMs}
        expandedCategory={expandedCategory}
        onCategoryClick={onCategoryClick}
      />

      {/* Expanded Features Table */}
      {expandedCategory && Object.keys(expandedFeaturesData).length > 0 && (
        <ExpandedFeaturesTable
          expandedCategory={expandedCategory}
          expandedFeaturesData={expandedFeaturesData}
          selectedOEMs={selectedOEMs}
          showBusinessModelInDetails={showBusinessModelInDetails}
        />
      )}
    </div>
  )
}

export default CategoryAnalysisTable
