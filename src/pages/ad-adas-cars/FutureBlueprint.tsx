import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"

const subTabs = ["Global Footprint", "Key Technology Investments", "Core Technology Roadmap", "Vehicle-Level Roadmap"]

const FutureBlueprint = () => {
  const [selectedRegion, setSelectedRegion] = useState("US")
  const [selectedCategory, setSelectedCategory] = useState("oem")
  const [selectedSubTab, setSelectedSubTab] = useState(subTabs[0])

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        subTabs={subTabs}
        selectedSubTab={selectedSubTab}
        onSubTabChange={setSelectedSubTab}
      />
    </AdAdasCarsLayout>
  )
}

export default FutureBlueprint
