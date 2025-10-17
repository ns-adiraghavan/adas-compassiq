import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import SubTabContent from "@/components/ad-adas-cars/SubTabContent"

const subTabs = ["Global Footprint", "Key Technology Investments", "Core Technology Roadmap", "Vehicle-Level Roadmap"]

const FutureBlueprint = () => {
  const [selectedRegion, setSelectedRegion] = useState("US")
  const [selectedCategory, setSelectedCategory] = useState("oem")
  const [searchParams] = useSearchParams()
  const selectedSubTab = searchParams.get("tab") || subTabs[0]

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      >
        <SubTabContent
          selectedSubTab={selectedSubTab}
          selectedRegion={selectedRegion}
          selectedCategory={selectedCategory}
        />
      </AdAdasCarsLayout.Content>
    </AdAdasCarsLayout>
  )
}

export default FutureBlueprint
