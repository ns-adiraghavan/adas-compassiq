import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import usMapRnd from "@/assets/maps/us-rnd.png"
import usMapTestingExpansion from "@/assets/maps/us-testing-expansion.png"
import europeMap from "@/assets/maps/europe.png"
import chinaMap from "@/assets/maps/china.png"

interface RegionalMapVisualizationProps {
  facilities: FacilityLocation[]
  region: string
}

const RegionalMapVisualization = ({ facilities, region }: RegionalMapVisualizationProps) => {
  const [hoveredFacility, setHoveredFacility] = useState<FacilityLocation | null>(null)

  // Group facilities by location to get unique locations with all their facilities
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    if (!acc[facility.location]) {
      acc[facility.location] = []
    }
    acc[facility.location].push(facility)
    return acc
  }, {} as Record<string, FacilityLocation[]>)

  const rdFacilities = facilities.filter(f => f.facilityType === "R&D Center")
  const testingExpansionFacilities = facilities.filter(f => f.facilityType === "Testing & Expansion")

  // Select map based on region and facility types
  const getMapImage = () => {
    if (region === "US") {
      const hasRnd = rdFacilities.length > 0
      const hasTestingExpansion = testingExpansionFacilities.length > 0
      
      if (hasRnd && !hasTestingExpansion) return usMapRnd
      if (hasTestingExpansion) return usMapTestingExpansion
      return usMapRnd
    } else if (region === "Europe") {
      return europeMap
    } else if (region === "China") {
      return chinaMap
    }
    return usMapRnd
  }

  // Get unique locations with their coordinates for labels
  const uniqueLocations = Object.entries(facilitiesByLocation).map(([location, locationFacilities]) => ({
    location,
    facilities: locationFacilities,
    lat: locationFacilities[0].lat,
    lng: locationFacilities[0].lng,
  })).filter(loc => loc.lat !== undefined && loc.lng !== undefined)

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-foreground">Facility Distribution - {region}</h3>
          <div className="text-xs text-muted-foreground space-x-4">
            <span>Total Locations: {uniqueLocations.length}</span>
            <span>R&D Centers: {rdFacilities.length}</span>
            <span>Testing & Expansion: {testingExpansionFacilities.length}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="relative w-full mx-auto" style={{ minHeight: '600px', height: '70vh' }}>
          <img
            src={getMapImage()}
            alt={`${region} Map`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Location labels and markers */}
          {uniqueLocations.map((locationData, idx) => {
            const hasRnd = locationData.facilities.some(f => f.facilityType === "R&D Center")
            const hasTestingExpansion = locationData.facilities.some(f => f.facilityType === "Testing & Expansion")
            
            return (
              <div
                key={`location-${idx}`}
                className="absolute -ml-3 -mt-3"
                style={{
                  left: `${locationData.lng}%`,
                  top: `${locationData.lat}%`,
                }}
              >
                {/* Marker */}
                <div
                  className="w-8 h-8 cursor-pointer transform transition-all hover:scale-125 relative z-20"
                  onMouseEnter={() => setHoveredFacility(locationData.facilities[0])}
                  onMouseLeave={() => setHoveredFacility(null)}
                >
                  <div className="w-full h-full rounded-full bg-[#2DD4BF] border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {locationData.facilities.length}
                    </span>
                  </div>
                </div>
                
                {/* Location label */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                  <div className="bg-background/95 border-2 border-primary/50 rounded px-3 py-1 shadow-md">
                    <div className="text-xs font-bold text-foreground">
                      {locationData.location}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-medium">
                      {hasRnd && "R&D"}
                      {hasRnd && hasTestingExpansion && " • "}
                      {hasTestingExpansion && "Test/Exp"}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Tooltip */}
          {hoveredFacility && hoveredFacility.lat !== undefined && hoveredFacility.lng !== undefined && (
            <div
              className="absolute z-50 bg-background border-2 border-primary rounded-lg shadow-2xl p-4 min-w-[280px] max-w-[400px] pointer-events-none"
              style={{
                left: `${hoveredFacility.lng}%`,
                top: `${hoveredFacility.lat - 20}%`,
                transform: 'translateX(-50%) translateY(-100%)',
              }}
            >
              <div className="text-sm space-y-3">
                <div className="font-bold text-foreground border-b-2 border-primary pb-2 text-base">
                  {hoveredFacility.location}
                </div>
                {/* Show all facilities at this location */}
                {facilitiesByLocation[hoveredFacility.location]?.map((fac, idx) => (
                  <div key={idx} className="space-y-1 bg-muted/50 p-2 rounded">
                    <div className="flex items-start gap-2">
                      <div className="text-xs font-semibold text-primary min-w-[80px]">
                        {fac.facilityType}
                      </div>
                      <div className="text-xs font-medium text-foreground flex-1">
                        {fac.oem}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {fac.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#2DD4BF] border-2 border-white flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">#</span>
            </div>
            <span className="text-muted-foreground">Facility Locations (hover for details)</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RegionalMapVisualization
