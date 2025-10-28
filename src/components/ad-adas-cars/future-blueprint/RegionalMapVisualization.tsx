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
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{uniqueLocations}</div>
            <div className="text-sm text-muted-foreground">Unique Locations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-1">{rdFacilities.length}</div>
            <div className="text-sm text-muted-foreground">R&D Centers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chart-2">{testingFacilities.length}</div>
            <div className="text-sm text-muted-foreground">Testing & Expansion</div>
          </div>
        </div>
      </Card>

      {/* Map Visualization with Interactive SVG Markers */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          {region} Facility Distribution
        </h3>
        <div className="relative w-full aspect-[16/10] bg-muted/20 rounded-lg overflow-hidden border border-border">
          <MapComponent />
          
          {/* Legend overlay positioned on the map */}
          <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-xl max-w-xs z-50">
            <div className="text-sm font-semibold mb-3 text-foreground">Legend</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-chart-1 border-2 border-white flex items-center justify-center shadow-md">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">R&D Centers</div>
                  <div>{rdFacilities.length} facilities</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-chart-2 border-2 border-white flex items-center justify-center shadow-md">
                  <FlaskConical className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">Testing & Expansion</div>
                  <div>{testingFacilities.length} facilities</div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Hover over markers for details
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RegionalMapVisualization
