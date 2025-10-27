import { Card } from "@/components/ui/card"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import usRndMap from "@/assets/maps/us-rnd.png"
import usTestingMap from "@/assets/maps/us-testing-expansion.png"
import chinaMap from "@/assets/maps/china.png"
import europeMap from "@/assets/maps/europe.png"

interface RegionalMapVisualizationProps {
  facilities: FacilityLocation[]
  region: string
}

const RegionalMapVisualization = ({ facilities, region }: RegionalMapVisualizationProps) => {
  // Separate facilities by type
  const rdFacilities = facilities.filter(f => f.facilityType === "R&D Center")
  const testingFacilities = facilities.filter(f => f.facilityType === "Testing & Expansion")

  const getMapImage = () => {
    if (region === "US") {
      // Show R&D map if only R&D facilities, otherwise show testing/expansion
      if (rdFacilities.length > 0 && testingFacilities.length === 0) {
        return usRndMap
      }
      return usTestingMap
    } else if (region === "China") {
      return chinaMap
    } else if (region === "Europe") {
      return europeMap
    }
    return usTestingMap
  }

  // Get unique locations
  const uniqueLocations = [...new Set(facilities.map(f => f.location))].length

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

      {/* Map Visualization with Legend Overlay */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          {region} Facility Distribution
        </h3>
        <div className="relative w-full">
          <img 
            src={getMapImage()} 
            alt={`${region} Facility Map`}
            className="w-full h-auto rounded-lg"
          />
          
          {/* Legend overlay positioned on the map */}
          <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-xl max-w-xs">
            <div className="text-sm font-semibold mb-3 text-foreground">Legend</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-chart-1/80 border border-chart-1" />
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">R&D Centers</div>
                  <div>{rdFacilities.length} facilities across regions</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-chart-2/80 border border-chart-2" />
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">Testing & Expansion</div>
                  <div>{testingFacilities.length} facilities across regions</div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Shaded regions indicate facility presence
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RegionalMapVisualization
