import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useGlobalFootprintData } from "@/hooks/useGlobalFootprintData"
import FacilityCards from "./FacilityCards"
import AnnouncementsTable from "./AnnouncementsTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface GlobalFootprintProps {
  selectedRegion: string
  selectedCategory: string
}

const GlobalFootprint = ({ selectedRegion }: GlobalFootprintProps) => {
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string>("All")
  const [facilityType, setFacilityType] = useState<string>("All")
  
  const { data, isLoading } = useGlobalFootprintData(selectedRegion, selectedOEM, facilityType)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const oems = data?.oems || []
  const facilityTypes = ["All", "R&D Center", "Testing"]

  return (
    <div className="space-y-6">
      {/* Facility Type Buttons */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="space-y-4">
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Facility Type</h3>
            <div className="flex flex-wrap gap-2">
              {facilityTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => setFacilityType(type)}
                  variant={facilityType === type ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-300"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Player Selector</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedOEM("All")}
                variant={selectedOEM === "All" ? "default" : "outline"}
                size="sm"
                className="transition-all duration-300"
              >
                All
              </Button>
              {oems.map((oem) => (
                <Button
                  key={oem}
                  onClick={() => setSelectedOEM(oem)}
                  variant={selectedOEM === oem ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-300"
                >
                  {oem}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* R&D Centers */}
        <FacilityCards 
          facilities={data?.facilities || []} 
          title="R&D Centers"
          facilityType="R&D Center"
        />

        {/* Testing Facilities */}
        <FacilityCards 
          facilities={data?.facilities || []} 
          title="Testing Facilities"
          facilityType="Testing"
        />
      </div>

      {/* Announcements Section */}
      <AnnouncementsTable facilities={data?.facilities || []} />
    </div>
  )
}

export default GlobalFootprint
