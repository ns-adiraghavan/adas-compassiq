import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useGlobalFootprintData } from "@/hooks/useGlobalFootprintData"
import RegionalMapVisualization from "./RegionalMapVisualization"
import AnnouncementsTable from "./AnnouncementsTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface GlobalFootprintProps {
  selectedRegion: string
  selectedCategory: string
}

const GlobalFootprint = ({ selectedRegion, selectedCategory }: GlobalFootprintProps) => {
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string>("All")
  const [facilityType, setFacilityType] = useState<string>("All")
  
  const { data, isLoading } = useGlobalFootprintData(selectedRegion, selectedCategory, selectedOEM, facilityType)

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
  const facilityTypes = ["All", "R&D Center", "Testing & Expansion"]
  const filteredFacilities = data?.facilities || []

  return (
    <div className="space-y-6">
      {/* Filter Controls - Lighter styling */}
      <div className="p-5 bg-background/30 backdrop-blur-sm rounded-xl border border-border/30">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Facility Type</h3>
            <div className="flex flex-wrap gap-2">
              {facilityTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => setFacilityType(type)}
                  variant={facilityType === type ? "default" : "outline"}
                  size="sm"
                  className={`transition-all duration-300 ${
                    facilityType === type 
                      ? 'ring-4 ring-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]' 
                      : 'hover:ring-2 hover:ring-primary/10'
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-border/50 pt-4">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Player Selector</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedOEM("All")}
                variant={selectedOEM === "All" ? "default" : "outline"}
                size="sm"
                className={`transition-all duration-300 ${
                  selectedOEM === "All" 
                    ? 'ring-4 ring-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]' 
                    : 'hover:ring-2 hover:ring-primary/10'
                }`}
              >
                All
              </Button>
              {oems.map((oem) => (
                <Button
                  key={oem}
                  onClick={() => setSelectedOEM(oem)}
                  variant={selectedOEM === oem ? "default" : "outline"}
                  size="sm"
                  className={`transition-all duration-300 ${
                    selectedOEM === oem 
                      ? 'ring-4 ring-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.3)]' 
                      : 'hover:ring-2 hover:ring-primary/10'
                  }`}
                >
                  {oem}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Map + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          {filteredFacilities.length === 0 ? (
            <div className="p-12 text-center bg-background/20 backdrop-blur-sm rounded-xl border border-dashed border-border/50">
              <p className="text-muted-foreground text-lg">No facilities found matching the selected filters.</p>
            </div>
          ) : (
            <RegionalMapVisualization facilities={filteredFacilities} region={selectedRegion} />
          )}
        </div>

        {/* Key Insights/Announcements */}
        <div className="lg:col-span-1">
          <AnnouncementsTable facilities={filteredFacilities} />
        </div>
      </div>
    </div>
  )
}

export default GlobalFootprint
