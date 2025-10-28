import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import ADASGanttChart from "@/components/ad-adas-cars/homepage/ADASGanttChart"
import ADASVennDiagram from "@/components/ad-adas-cars/homepage/ADASVennDiagram"
import OEMCooperationTable from "@/components/ad-adas-cars/homepage/OEMCooperationTable"
import KeyInsightsBox from "@/components/ad-adas-cars/homepage/KeyInsightsBox"

const AdAdasHomepage = () => {
  const [selectedRegion, setSelectedRegion] = useState("US")
  const [selectedCategory, setSelectedCategory] = useState("oem")

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        defaultExpanded={false}
      >
        {/* Gantt Chart - Full Width */}
        <ADASGanttChart />

        {/* Bottom Section - Three Columns */}
        <div className="grid grid-cols-12 gap-6">
          {/* Venn Diagram - Left */}
          <div className="col-span-4">
            <ADASVennDiagram />
          </div>

          {/* OEM Cooperation Table - Center */}
          <div className="col-span-5">
            <OEMCooperationTable />
          </div>

          {/* Key Insights - Right */}
          <div className="col-span-3">
            <KeyInsightsBox />
          </div>
        </div>
      </AdAdasCarsLayout.Content>
    </AdAdasCarsLayout>
  )
}

export default AdAdasHomepage
