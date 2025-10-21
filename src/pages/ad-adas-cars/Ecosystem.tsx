import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import EcosystemTable from "@/components/ad-adas-cars/ecosystem/EcosystemTable"
import AVLandscapeInsights from "@/components/ad-adas-cars/current-snapshot/AVLandscapeInsights"

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
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EcosystemTable 
              selectedRegion={selectedRegion}
              selectedCategory={selectedCategory}
            />
          </div>
          <div className="lg:col-span-1">
            <AVLandscapeInsights />
          </div>
        </div>
      </AdAdasCarsLayout.Content>
    </AdAdasCarsLayout>
  )
}

export default Ecosystem
