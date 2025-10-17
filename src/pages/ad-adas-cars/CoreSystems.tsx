import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"

const subTabs = ["Semantics", "Computational Core", "Driving Intelligence", "Connectivity & Localization", "Advanced Technologies"]

const CoreSystems = () => {
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

export default CoreSystems
