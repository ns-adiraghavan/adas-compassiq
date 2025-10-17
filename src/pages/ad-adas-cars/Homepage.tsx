import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import CountryButtons from "@/components/CountryButtons"
import PlayerCategoryButtons from "@/components/ad-adas-cars/PlayerCategoryButtons"
import { useCountryContext } from "@/contexts/CountryContext"
import { useTheme } from "@/contexts/ThemeContext"

const AdAdasHomepage = () => {
  const { selectedCountry, setSelectedCountry } = useCountryContext()
  const [selectedCategory, setSelectedCategory] = useState("oem")
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

        {/* Content Placeholder */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className={`text-center ${theme.textMuted}`}>
            <p className="text-lg">Content for Homepage will be displayed here</p>
            <p className="text-sm mt-2">Selected: {selectedCountry} | {selectedCategory}</p>
          </div>
        </div>
      </div>
    </AdAdasCarsLayout>
  )
}

export default AdAdasHomepage
