import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { Building2, FlaskConical } from "lucide-react"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface USMapSVGProps {
  facilities: FacilityLocation[]
}

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

// Map city locations to [longitude, latitude] coordinates
const cityCoordinates: Record<string, [number, number]> = {
  // Michigan
  "Dearborn, MI": [-83.1763, 42.3223],
  "Detroit, MI": [-83.0458, 42.3314],
  "Detroit,Michigan, US": [-83.0458, 42.3314],
  "Ann Arbor, MI": [-83.7430, 42.2808],
  "Milford, MI": [-83.6000, 42.5917],
  "Warren, MI": [-83.0277, 42.5145],
  "Romeo, MI": [-83.0130, 42.8023],
  "Plymouth, Michigan": [-83.4703, 42.3712],
  // California
  "Palo Alto, CA": [-122.1430, 37.4419],
  "Palo Alto, California": [-122.1430, 37.4419],
  "Mountain View, CA": [-122.0838, 37.3861],
  "San Francisco, CA": [-122.4194, 37.7749],
  "Fremont, CA": [-121.9886, 37.5485],
  "Fremont, California": [-121.9886, 37.5485],
  "Irvine, California": [-117.8265, 33.6846],
  // Texas
  "Austin, TX": [-97.7431, 30.2672],
  // Arizona
  "Phoenix, AZ": [-112.0740, 33.4484],
  "Yuma, AZ": [-114.6276, 32.6927],
  "Wittmann, AZ": [-112.5285, 33.7814],
  // Georgia
  "Atlanta, GA": [-84.3880, 33.7490],
  "Georgia, Atlanta,US": [-84.3880, 33.7490],
  // Pennsylvania
  "Pittsburgh, PA": [-79.9959, 40.4406],
  // Washington
  "Seattle, WA": [-122.3321, 47.6062],
  // Nevada
  "Las Vegas, NV": [-115.1398, 36.1699],
  // New York
  "Buffalo, NY": [-78.8784, 42.8864],
  // South Carolina
  "Greenville, SC": [-82.3940, 34.8526],
  // Illinois
  "Normal, Illinois,US": [-88.9906, 40.5142],
}

// Map locations to state names for coloring
const locationToState: Record<string, string> = {
  // Michigan
  "Dearborn, MI": "Michigan",
  "Detroit, MI": "Michigan",
  "Detroit,Michigan, US": "Michigan",
  "Ann Arbor, MI": "Michigan",
  "Milford, MI": "Michigan",
  "Warren, MI": "Michigan",
  "Romeo, MI": "Michigan",
  "Plymouth, Michigan": "Michigan",
  // California
  "Palo Alto, CA": "California",
  "Palo Alto, California": "California",
  "Mountain View, CA": "California",
  "San Francisco, CA": "California",
  "Fremont, CA": "California",
  "Fremont, California": "California",
  "Irvine, California": "California",
  // Texas
  "Austin, TX": "Texas",
  // Arizona
  "Phoenix, AZ": "Arizona",
  "Yuma, AZ": "Arizona",
  "Wittmann, AZ": "Arizona",
  // Georgia
  "Atlanta, GA": "Georgia",
  "Georgia, Atlanta,US": "Georgia",
  // Pennsylvania
  "Pittsburgh, PA": "Pennsylvania",
  // Washington
  "Seattle, WA": "Washington",
  // Nevada
  "Las Vegas, NV": "Nevada",
  // New York
  "Buffalo, NY": "New York",
  // South Carolina
  "Greenville, SC": "South Carolina",
  // Illinois
  "Normal, Illinois,US": "Illinois",
}

export const USMapSVG = ({ facilities }: USMapSVGProps) => {
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

  // Determine state colors based on facility types
  const getStateColor = (stateName: string) => {
    const stateFacilities = facilities.filter(f => locationToState[f.location] === stateName)
    if (stateFacilities.length === 0) return "hsl(var(--muted))"
    
    const hasRD = stateFacilities.some(f => f.facilityType === "R&D Center")
    const hasTesting = stateFacilities.some(f => f.facilityType === "Testing & Expansion")
    
    if (hasRD && hasTesting) return "hsl(var(--chart-3))"
    if (hasRD) return "hsl(var(--chart-1))"
    if (hasTesting) return "hsl(var(--chart-2))"
    return "hsl(var(--muted))"
  }

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      className="w-full h-full"
      projectionConfig={{
        scale: 1000,
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={getStateColor(geo.properties.name)}
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
