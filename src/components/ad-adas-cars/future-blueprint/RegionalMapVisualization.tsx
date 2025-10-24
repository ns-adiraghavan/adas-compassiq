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

  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    if (!acc[facility.location]) {
      acc[facility.location] = []
    }
    acc[facility.location].push(facility)
    return acc
  }, {} as Record<string, FacilityLocation[]>)

  const rdFacilities = facilities.filter(f => f.facilityType === "R&D Center")
  const testingFacilities = facilities.filter(f => f.facilityType === "Testing")
  const expansionFacilities = facilities.filter(f => f.facilityType === "Expansion")

  // Select map based on region and facility types
  const getMapImage = () => {
    if (region === "US") {
      const hasRnd = rdFacilities.length > 0
      const hasTestingOrExpansion = testingFacilities.length > 0 || expansionFacilities.length > 0
      
      if (hasRnd && !hasTestingOrExpansion) return usMapRnd
      if (hasTestingOrExpansion) return usMapTestingExpansion
      return usMapRnd
    } else if (region === "Europe") {
      return europeMap
    } else if (region === "China") {
      return chinaMap
    }
    return usMapRnd
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-foreground">Facility Distribution - {region}</h3>
          <div className="text-xs text-muted-foreground space-x-4">
            <span>Total: {facilities.length}</span>
            <span>R&D: {rdFacilities.length}</span>
            <span>Testing: {testingFacilities.length}</span>
            <span>Expansion: {expansionFacilities.length}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="relative w-full" style={{ paddingBottom: '66%' }}>
          <img
            src={getMapImage()}
            alt={`${region} Map`}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* R&D Center markers */}
          {rdFacilities.map((facility, idx) => (
            facility.lat !== undefined && facility.lng !== undefined && (
              <div
                key={`rd-${idx}`}
                className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer transform transition-transform hover:scale-125"
                style={{
                  left: `${facility.lng}%`,
                  top: `${facility.lat}%`,
                }}
                onMouseEnter={() => setHoveredFacility(facility)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                <div className="w-full h-full rounded-full bg-[#2DD4BF] border-2 border-white shadow-lg" />
              </div>
            )
          ))}

          {/* Testing facilities markers */}
          {testingFacilities.map((facility, idx) => (
            facility.lat !== undefined && facility.lng !== undefined && (
              <div
                key={`testing-${idx}`}
                className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer transform transition-transform hover:scale-125"
                style={{
                  left: `${facility.lng}%`,
                  top: `${facility.lat}%`,
                }}
                onMouseEnter={() => setHoveredFacility(facility)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                <div className="w-full h-full rounded-full bg-[#2DD4BF] border-2 border-white shadow-lg" />
              </div>
            )
          ))}

          {/* Expansion facilities markers */}
          {expansionFacilities.map((facility, idx) => (
            facility.lat !== undefined && facility.lng !== undefined && (
              <div
                key={`expansion-${idx}`}
                className="absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer transform transition-transform hover:scale-125"
                style={{
                  left: `${facility.lng}%`,
                  top: `${facility.lat}%`,
                }}
                onMouseEnter={() => setHoveredFacility(facility)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                <div className="w-full h-full rounded-full bg-[#2DD4BF] border-2 border-white shadow-lg" />
              </div>
            )
          ))}

          {/* Tooltip */}
          {hoveredFacility && hoveredFacility.lat !== undefined && hoveredFacility.lng !== undefined && (
            <div
              className="absolute z-10 bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px] pointer-events-none"
              style={{
                left: `${hoveredFacility.lng}%`,
                top: `${hoveredFacility.lat - 15}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="text-sm">
                <div className="font-semibold text-foreground mb-1">{hoveredFacility.oem}</div>
                <div className="text-xs text-muted-foreground mb-1">{hoveredFacility.location}</div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">{hoveredFacility.facilityType}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{hoveredFacility.details}</div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2DD4BF] border-2 border-white" />
            <span className="text-muted-foreground">R&D Center</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2DD4BF] border-2 border-white" />
            <span className="text-muted-foreground">Testing Facility</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2DD4BF] border-2 border-white" />
            <span className="text-muted-foreground">Expansion Plan</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RegionalMapVisualization
