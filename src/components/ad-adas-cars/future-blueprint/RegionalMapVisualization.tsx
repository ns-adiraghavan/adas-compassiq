import { Card } from "@/components/ui/card"
import { Building2, FlaskConical } from "lucide-react"
import { FacilityLocation, normalizeLocation } from "@/hooks/useGlobalFootprintData"
import { USMapSVG } from "./maps/USMapSVG"
import { EuropeMapSVG } from "./maps/EuropeMapSVG"
import { ChinaMapSVG } from "./maps/ChinaMapSVG"

interface RegionalMapVisualizationProps {
  facilities: FacilityLocation[]
  region: string
  facilityType?: string
}

const RegionalMapVisualization = ({ facilities, region, facilityType }: RegionalMapVisualizationProps) => {
  // Separate facilities by type
  const rdFacilities = facilities.filter(f => f.facilityType === "R&D Center")
  const testingFacilities = facilities.filter(f => f.facilityType === "Testing & Expansion")
  
  // Get unique locations (normalized to avoid counting duplicates with different formats)
  const uniqueLocations = [...new Set(facilities.map(f => normalizeLocation(f.location)))].length

  // Select appropriate map component
  const MapComponent = () => {
    switch(region) {
      case "US": return <USMapSVG facilities={facilities} />
      case "Europe": return <EuropeMapSVG facilities={facilities} />
      case "China": return <ChinaMapSVG facilities={facilities} />
      default: return <USMapSVG facilities={facilities} />
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Statistics - Frosted glass effect */}
      <div className="p-5 bg-background/40 backdrop-blur-md rounded-xl border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-foreground transition-transform group-hover:scale-110 duration-300">{uniqueLocations}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Unique Locations</div>
          </div>
          <div className="text-center group cursor-default border-l border-r border-dashed border-border/40">
            <div className="text-3xl font-bold text-chart-1 transition-transform group-hover:scale-110 duration-300">{rdFacilities.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">R&D Centers</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-chart-2 transition-transform group-hover:scale-110 duration-300">{testingFacilities.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Testing & Expansion</div>
          </div>
        </div>
      </div>

      {/* Map Visualization - Breathing effect */}
      <div className="p-6 bg-background/40 backdrop-blur-md rounded-xl border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.1)] transition-shadow duration-500">
        <h3 className="text-base font-semibold mb-4 text-foreground">
          {region} Facility Distribution
        </h3>
        <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg overflow-hidden border border-dashed border-border/40">
          <MapComponent />
          
          {/* Legend overlay - Refined frosted glass */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-xl border border-border/50 rounded-lg p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-xs z-50">
            <div className="text-xs font-semibold mb-3 text-foreground uppercase tracking-wider">Legend</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 group cursor-default">
                <div className="w-6 h-6 rounded-full bg-chart-1 border-2 border-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-300">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">R&D Centers</div>
                  <div>{rdFacilities.length} facilities</div>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-default">
                <div className="w-6 h-6 rounded-full bg-chart-2 border-2 border-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-300">
                  <FlaskConical className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">Testing & Expansion</div>
                  <div>{testingFacilities.length} facilities</div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-dashed border-border/50 text-xs text-muted-foreground">
              Hover over markers for details
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegionalMapVisualization
