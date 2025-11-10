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

  // Calculate counts for filter badges
  const allFacilities = data?.facilities || []
  const rdCount = allFacilities.filter(f => f.facilityType === "R&D Center").length
  const testingCount = allFacilities.filter(f => f.facilityType === "Testing & Expansion").length
  const oemCounts = oems.reduce((acc, oem) => {
    acc[oem] = allFacilities.filter(f => f.oem === oem).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Left Sidebar - Filters with Numbers */}
      <div className="space-y-4">
        {/* Facility Type Filters */}
        <div className="p-5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
          <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Facility Type</h3>
          <div className="space-y-2">
            <button
              onClick={() => setFacilityType("All")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                facilityType === "All"
                  ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20'
                  : 'bg-background/50 text-foreground hover:bg-background/80 border border-border/50'
              }`}
            >
              <span>All Types</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                facilityType === "All" ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {allFacilities.length}
              </span>
            </button>
            <button
              onClick={() => setFacilityType("R&D Center")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                facilityType === "R&D Center"
                  ? 'bg-chart-1 text-white shadow-md ring-2 ring-chart-1/20'
                  : 'bg-background/50 text-foreground hover:bg-background/80 border border-border/50'
              }`}
            >
              <span>R&D Centers</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                facilityType === "R&D Center" ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {rdCount}
              </span>
            </button>
            <button
              onClick={() => setFacilityType("Testing & Expansion")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                facilityType === "Testing & Expansion"
                  ? 'bg-chart-2 text-white shadow-md ring-2 ring-chart-2/20'
                  : 'bg-background/50 text-foreground hover:bg-background/80 border border-border/50'
              }`}
            >
              <span>Testing & Expansion</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                facilityType === "Testing & Expansion" ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {testingCount}
              </span>
            </button>
          </div>
        </div>

        {/* Player Selector Filters */}
        <div className="p-5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
          <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Player Selector</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedOEM("All")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedOEM === "All"
                  ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20'
                  : 'bg-background/50 text-foreground hover:bg-background/80 border border-border/50'
              }`}
            >
              <span>All Players</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedOEM === "All" ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {allFacilities.length}
              </span>
            </button>
            {oems.map((oem) => (
              <button
                key={oem}
                onClick={() => setSelectedOEM(oem)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedOEM === oem
                    ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20'
                    : 'bg-background/50 text-foreground hover:bg-background/80 border border-border/50'
                }`}
              >
                <span className="truncate">{oem}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedOEM === oem ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {oemCounts[oem] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Map and Insights */}
      <div className="space-y-6">
        {/* Map Visualization */}
        {filteredFacilities.length === 0 ? (
          <div className="p-12 text-center bg-background/20 backdrop-blur-sm rounded-xl border border-dashed border-border/50">
            <p className="text-muted-foreground text-lg">No facilities found matching the selected filters.</p>
          </div>
        ) : (
          <>
            <RegionalMapVisualization facilities={filteredFacilities} region={selectedRegion} />
            <AnnouncementsTable facilities={filteredFacilities} />
          </>
        )}
      </div>
    </div>
  )
}

export default GlobalFootprint
