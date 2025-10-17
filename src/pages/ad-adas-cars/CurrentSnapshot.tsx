import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import { useTheme } from "@/contexts/ThemeContext"

const subTabs = ["AV Landscape", "Portfolio Dynamics", "Operational Design Domain (ODD)"]

const CurrentSnapshot = () => {
  const [selectedRegion, setSelectedRegion] = useState("US")
  const [selectedCategory, setSelectedCategory] = useState("oem")
  const [searchParams] = useSearchParams()
  const selectedSubTab = searchParams.get("tab") || subTabs[0]
  const { theme } = useTheme()

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      >
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-8 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <h2 className="text-2xl font-bold mb-6">{selectedSubTab}</h2>
          <div className={`text-center ${theme.textMuted} py-12`}>
            <p className="text-lg">Content for {selectedSubTab} will be displayed here</p>
            <p className="text-sm mt-2">Region: {selectedRegion} | Category: {selectedCategory}</p>
          </div>
        </div>
      </AdAdasCarsLayout.Content>
    </AdAdasCarsLayout>
  )
}

export default CurrentSnapshot
