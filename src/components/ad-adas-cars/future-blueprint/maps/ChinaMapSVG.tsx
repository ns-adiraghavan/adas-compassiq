import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { Building2, FlaskConical } from "lucide-react"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface ChinaMapSVGProps {
  facilities: FacilityLocation[]
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Map city locations to [longitude, latitude] coordinates
const cityCoordinates: Record<string, [number, number]> = {
  "Beijing, China": [116.4074, 39.9042],
  "Shanghai, China": [121.4737, 31.2304],
  "Shenzhen, China": [114.0579, 22.5431],
  "Guangzhou, China": [113.2644, 23.1291],
  "Chengdu, China": [104.0668, 30.5728],
  "Hangzhou, China": [120.1551, 30.2741],
  "Wuhan, China": [114.3055, 30.5928],
  "Xi'an, China": [108.9398, 34.3416],
}

export const ChinaMapSVG = ({ facilities }: ChinaMapSVGProps) => {
  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    const existing = acc.find(f => f.location === facility.location)
    if (existing) {
      existing.facilities.push(facility)
    } else {
      acc.push({
        location: facility.location,
        coordinates: cityCoordinates[facility.location] || [0, 0],
        facilities: [facility]
      })
    }
    return acc
  }, [] as Array<{ location: string; coordinates: [number, number]; facilities: FacilityLocation[] }>)

  // Determine color based on facility types
  const getChinaColor = () => {
    if (facilities.length === 0) return "hsl(var(--muted))"
    
    const hasRD = facilities.some(f => f.facilityType === "R&D Center")
    const hasTesting = facilities.some(f => f.facilityType === "Testing & Expansion")
    
    if (hasRD && hasTesting) return "hsl(var(--chart-3))"
    if (hasRD) return "hsl(var(--chart-1))"
    if (hasTesting) return "hsl(var(--chart-2))"
    return "hsl(var(--muted))"
  }

  return (
    <ComposableMap
      projection="geoMercator"
      className="w-full h-full"
      projectionConfig={{
        center: [105, 35],
        scale: 600,
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies
            .filter(geo => geo.properties.name === "China")
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getChinaColor()}
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "hsl(var(--accent))", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
        }
      </Geographies>

      {/* Render facility markers */}
      {facilitiesByLocation.map((location) => {
        if (!location.coordinates[0] || !location.coordinates[1]) return null
        
        const rdCount = location.facilities.filter(f => f.facilityType === "R&D Center").length
        const testingCount = location.facilities.filter(f => f.facilityType === "Testing & Expansion").length
        const primaryType = rdCount >= testingCount ? "R&D Center" : "Testing & Expansion"
        
        return (
          <Marker key={location.location} coordinates={location.coordinates}>
            <HoverCard openDelay={0} closeDelay={0}>
              <HoverCardTrigger asChild>
                <g className="cursor-pointer">
                  {/* Pulsing circle animation */}
                  <circle
                    r={12}
                    fill={primaryType === "R&D Center" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                    opacity={0.3}
                    className="animate-pulse"
                  />
                  
                  {/* Main marker */}
                  <circle
                    r={8}
                    fill={primaryType === "R&D Center" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                    stroke="white"
                    strokeWidth={2}
                  />
                  
                  {/* Icon */}
                  <foreignObject x={-6} y={-6} width={12} height={12}>
                    {primaryType === "R&D Center" ? (
                      <Building2 className="w-3 h-3 text-white" />
                    ) : (
                      <FlaskConical className="w-3 h-3 text-white" />
                    )}
                  </foreignObject>
                  
                  {/* Count badge */}
                  {location.facilities.length > 1 && (
                    <>
                      <circle cx={8} cy={-8} r={6} fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth={1} />
                      <text x={8} y={-6} textAnchor="middle" fontSize={8} fill="hsl(var(--foreground))" fontWeight="bold">
                        {location.facilities.length}
                      </text>
                    </>
                  )}
                </g>
              </HoverCardTrigger>
              
              <HoverCardContent className="w-80 z-[60]">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{location.location}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rdCount > 0 && `${rdCount} R&D Center${rdCount > 1 ? 's' : ''}`}
                      {rdCount > 0 && testingCount > 0 && ', '}
                      {testingCount > 0 && `${testingCount} Testing & Expansion`}
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {location.facilities.map((facility, idx) => (
                      <div key={idx} className="text-xs border-t border-border pt-2">
                        <div className="flex items-start gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            facility.facilityType === "R&D Center" ? "bg-chart-1" : "bg-chart-2"
                          }`}>
                            {facility.facilityType === "R&D Center" ? (
                              <Building2 className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <FlaskConical className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{facility.oem}</div>
                            <div className="text-muted-foreground">{facility.facilityType}</div>
                            {facility.details && (
                              <div className="text-muted-foreground mt-1">{facility.details}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Marker>
        )
      })}
    </ComposableMap>
  )
}
