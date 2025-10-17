import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import CountryButtons from "@/components/CountryButtons"
import PlayerCategoryButtons from "@/components/ad-adas-cars/PlayerCategoryButtons"
import SubTabButtons from "@/components/ad-adas-cars/SubTabButtons"
import { useCountryContext } from "@/contexts/CountryContext"
import { useTheme } from "@/contexts/ThemeContext"

const subTabs = ["Global Footprint", "Key Technology Investments", "Core Technology Roadmap", "Vehicle-Level Roadmap"]

const FutureBlueprint = () => {
  const { selectedCountry, setSelectedCountry } = useCountryContext()
  const [selectedCategory, setSelectedCategory] = useState("oem")
  const [selectedSubTab, setSelectedSubTab] = useState(subTabs[0])
  const { theme } = useTheme()

  return (
    <AdAdasCarsLayout>
      <div className="container mx-auto px-8 py-6 space-y-6">
        {/* Countries/Regions Section */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <CountryButtons
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />
        </div>

        {/* Player Category Section */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <PlayerCategoryButtons
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Sub-Tab Buttons */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Blueprint Type</h3>
          <SubTabButtons
            tabs={subTabs}
            selectedTab={selectedSubTab}
            onTabChange={setSelectedSubTab}
          />
        </div>

        {/* Content Placeholder */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className={`text-center ${theme.textMuted}`}>
            <p className="text-lg">Content for {selectedSubTab} will be displayed here</p>
            <p className="text-sm mt-2">Selected: {selectedCountry} | {selectedCategory}</p>
          </div>
        </div>
      </div>
    </AdAdasCarsLayout>
  )
}

export default FutureBlueprint
