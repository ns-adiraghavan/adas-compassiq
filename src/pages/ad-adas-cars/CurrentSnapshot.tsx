import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import { useCountryContext } from "@/contexts/CountryContext"

const subTabs = ["AV Landscape", "Portfolio Dynamics", "Operational Design Domain (ODD)"]

const CurrentSnapshot = () => {
  const { selectedCountry, setSelectedCountry } = useCountryContext()
  const [selectedCategory, setSelectedCategory] = useState("oem")
  const [selectedSubTab, setSelectedSubTab] = useState(subTabs[0])

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        subTabs={subTabs}
        selectedSubTab={selectedSubTab}
        onSubTabChange={setSelectedSubTab}
      />
    </AdAdasCarsLayout>
  )
}

export default CurrentSnapshot
