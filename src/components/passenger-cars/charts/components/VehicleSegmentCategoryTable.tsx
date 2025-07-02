
import { useTheme } from "@/contexts/ThemeContext"
import { useVehicleSegmentTableData } from "../hooks/useVehicleSegmentTableData"
import CategoryCountsTable from "./CategoryCountsTable"
import ExpandedFeaturesTable from "./ExpandedFeaturesTable"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentCategoryTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  groupingMode: GroupingMode
  expandedCategory: string | null
  onCategoryClick: (category: string) => void
}

const VehicleSegmentCategoryTable = ({ 
  selectedCountry, 
  selectedOEMs, 
  groupingMode,
  expandedCategory, 
  onCategoryClick 
}: VehicleSegmentCategoryTableProps) => {
  const { theme } = useTheme()
  const { categories, mainColumns, subColumns, categoryData, grandTotals } = useVehicleSegmentTableData(
    selectedCountry,
    selectedOEMs,
    groupingMode
  )

  if (categories.length === 0) {
    return (
      <div className={`text-center py-8 ${theme.textMuted}`}>
        {selectedOEMs.length === 0 
          ? "Please select at least one OEM to view the analysis"
          : "No data available for the selected filters"
        }
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CategoryCountsTable
        categories={categories}
        mainColumns={mainColumns}
        subColumns={subColumns}
        categoryData={categoryData}
        grandTotals={grandTotals}
        expandedCategory={expandedCategory}
        onCategoryClick={onCategoryClick}
      />

      {expandedCategory && (
        <ExpandedFeaturesTable
          selectedCountry={selectedCountry}
          selectedOEMs={selectedOEMs}
          groupingMode={groupingMode}
          expandedCategory={expandedCategory}
          mainColumns={mainColumns}
          subColumns={subColumns}
        />
      )}
    </div>
  )
}

export default VehicleSegmentCategoryTable
