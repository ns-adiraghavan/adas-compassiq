import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

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
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null)
  const [clickScale, setClickScale] = useState<string | null>(null)

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
                  hover: { fill: getChinaColor(), opacity: 0.8, outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
        }
      </Geographies>

      {/* Render facility markers */}
      {facilitiesByLocation.map((location) => {
        if (!location.coordinates[0] || !location.coordinates[1]) {
          console.warn(`Missing coordinates for location: ${location.location}`)
          return null
        }
        
        const rdCount = location.facilities.filter(f => f.facilityType === "R&D Center").length
        const testingCount = location.facilities.filter(f => f.facilityType === "Testing & Expansion").length
        const primaryType = rdCount >= testingCount ? "R&D Center" : "Testing & Expansion"
        const markerId = location.location
        
        const handleMarkerClick = () => {
          setOpenMarkerId(openMarkerId === markerId ? null : markerId)
          setClickScale(markerId)
          setTimeout(() => setClickScale(null), 200)
        }
        
        return (
          <Marker key={location.location} coordinates={location.coordinates}>
            <Popover open={openMarkerId === markerId} onOpenChange={(open) => setOpenMarkerId(open ? markerId : null)}>
              <PopoverTrigger asChild>
                <g 
                  className="cursor-pointer transition-transform duration-200 hover:opacity-90"
                  style={{ 
                    transform: clickScale === markerId ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={handleMarkerClick}
                >
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
                  
                  {/* Icon using SVG paths */}
                  {primaryType === "R&D Center" ? (
                    <g transform="translate(-4, -4)">
                      <path d="M2 2h4v6H2z M3 3.5h1 M4.5 3.5h1 M3 5h1 M4.5 5h1" fill="white" stroke="white" strokeWidth={0.3} />
                    </g>
                  ) : (
                    <g transform="translate(-4, -4)">
                      <path d="M3.5 1.5v1.5l-1.5 3c0 0.8 0.6 1.5 1.5 1.5h1c0.8 0 1.5-0.6 1.5-1.5l-1.5-3V1.5M3 1.5h2" fill="white" stroke="white" strokeWidth={0.3} />
                    </g>
                  )}
                  
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
              </PopoverTrigger>
              
              <PopoverContent className="w-80 z-[100]">
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
                            <svg viewBox="0 0 8 8" className="w-2.5 h-2.5">
                              {facility.facilityType === "R&D Center" ? (
                                <path d="M2 2h4v6H2z M3 3.5h1 M4.5 3.5h1 M3 5h1 M4.5 5h1" fill="white" stroke="white" strokeWidth={0.3} />
                              ) : (
                                <path d="M3.5 1.5v1.5l-1.5 3c0 0.8 0.6 1.5 1.5 1.5h1c0.8 0 1.5-0.6 1.5-1.5l-1.5-3V1.5M3 1.5h2" fill="white" stroke="white" strokeWidth={0.3} />
                              )}
                            </svg>
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
              </PopoverContent>
            </Popover>
          </Marker>
        )
      })}
    </ComposableMap>
  )
}
