import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"

const Ecosystem = () => {
  const [selectedRegion, setSelectedRegion] = useState("US")
  const [selectedCategory, setSelectedCategory] = useState("oem")

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </AdAdasCarsLayout>
  )
}

export default Ecosystem
