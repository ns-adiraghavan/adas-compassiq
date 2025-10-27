import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, FlaskConical } from "lucide-react"

interface USMapSVGProps {
  facilities: FacilityLocation[]
}

// Coordinate mapping for US cities to SVG coordinates
const cityCoordinates: { [key: string]: { x: number; y: number } } = {
  "Dearborn": { x: 620, y: 280 },
  "Detroit": { x: 620, y: 280 },
  "Warren": { x: 625, y: 278 },
  "Pontiac": { x: 622, y: 275 },
  "Milford": { x: 615, y: 285 },
  "Palo Alto": { x: 120, y: 380 },
  "San Francisco": { x: 115, y: 370 },
  "Mountain View": { x: 125, y: 375 },
  "Fremont": { x: 128, y: 378 },
  "Pittsburgh": { x: 700, y: 310 },
  "Phoenix": { x: 200, y: 450 },
  "Austin": { x: 480, y: 520 },
  "Seattle": { x: 140, y: 180 },
  "Las Vegas": { x: 180, y: 410 },
  "San Diego": { x: 130, y: 450 },
  "Los Angeles": { x: 135, y: 430 },
  "Denver": { x: 350, y: 350 },
  "Chicago": { x: 600, y: 290 },
  "Boston": { x: 780, y: 260 },
  "New York": { x: 770, y: 280 },
  "Atlanta": { x: 660, y: 450 },
  "Miami": { x: 720, y: 570 },
  "Dallas": { x: 490, y: 480 },
  "Houston": { x: 500, y: 520 },
}

// State paths for coloring
const statePaths = {
  "MI": "M620,250 L660,250 L665,280 L665,310 L640,320 L610,310 L605,275 Z",
  "CA": "M80,350 L150,340 L160,400 L165,480 L140,500 L90,490 L85,420 Z",
  "PA": "M685,290 L735,285 L738,315 L710,325 L685,320 Z",
  "AZ": "M180,400 L250,395 L255,470 L185,475 Z",
  "TX": "M440,460 L560,455 L565,540 L545,580 L440,575 L435,520 Z",
  "WA": "M100,140 L180,135 L185,190 L105,195 Z",
  "NV": "M150,360 L220,355 L230,450 L155,455 Z",
  "CO": "M310,320 L390,315 L395,390 L315,395 Z",
  "IL": "M580,270 L630,265 L635,320 L585,325 Z",
  "MA": "M765,245 L795,242 L798,270 L768,273 Z",
  "NY": "M740,250 L790,245 L795,295 L745,300 Z",
  "GA": "M640,420 L685,415 L690,480 L645,485 Z",
  "FL": "M690,500 L730,495 L745,580 L700,585 Z",
}

export const USMapSVG = ({ facilities }: USMapSVGProps) => {
  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    const key = facility.location
    if (!acc[key]) acc[key] = []
    acc[key].push(facility)
    return acc
  }, {} as { [key: string]: FacilityLocation[] })

  // Determine state colors based on facility types
  const getStateColor = (state: string) => {
    const stateFacilities = facilities.filter(f => f.location.includes(state))
    if (stateFacilities.length === 0) return "hsl(var(--muted))"
    
    const hasRD = stateFacilities.some(f => f.facilityType === "R&D Center")
    const hasTesting = stateFacilities.some(f => f.facilityType === "Testing & Expansion")
    
    if (hasRD && hasTesting) return "hsl(var(--chart-3))"
    if (hasRD) return "hsl(var(--chart-1))"
    if (hasTesting) return "hsl(var(--chart-2))"
    return "hsl(var(--muted))"
  }

  const getMarkerCoordinates = (location: string) => {
    // Try exact match first
    const exactMatch = cityCoordinates[location]
    if (exactMatch) return exactMatch

    // Try partial match
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (location.includes(city) || city.includes(location)) {
        return coords
      }
    }

    return null
  }

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 900 600"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Draw states */}
        {Object.entries(statePaths).map(([state, path]) => (
          <path
            key={state}
            d={path}
            fill={getStateColor(state)}
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
            className="transition-all duration-300 hover:opacity-80"
          />
        ))}

        {/* Draw facility markers */}
        {Object.entries(facilitiesByLocation).map(([location, locationFacilities]) => {
          const coords = getMarkerCoordinates(location)
          if (!coords) return null

          const hasRD = locationFacilities.some(f => f.facilityType === "R&D Center")
          const hasTesting = locationFacilities.some(f => f.facilityType === "Testing & Expansion")

          return (
            <HoverCard key={location} openDelay={0} closeDelay={100}>
              <HoverCardTrigger asChild>
                <g
                  className="cursor-pointer transition-transform duration-200 hover:scale-125"
                  style={{ transformOrigin: `${coords.x}px ${coords.y}px` }}
                >
                  {/* Pulsing animation circle */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="12"
                    fill={hasRD ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                    opacity="0.3"
                    className="animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  
                  {/* Main marker */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="8"
                    fill={hasRD ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                    stroke="hsl(var(--background))"
                    strokeWidth="3"
                    className="drop-shadow-xl"
                  />
                  
                  {/* Count badge if multiple facilities */}
                  {locationFacilities.length > 1 && (
                    <>
                      <circle
                        cx={coords.x + 10}
                        cy={coords.y - 10}
                        r="7"
                        fill="hsl(var(--primary))"
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                      />
                      <text
                        x={coords.x + 10}
                        y={coords.y - 7}
                        fontSize="9"
                        fontWeight="bold"
                        fill="hsl(var(--primary-foreground))"
                        textAnchor="middle"
                      >
                        {locationFacilities.length}
                      </text>
                    </>
                  )}
                </g>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4" side="top">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{location}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {hasRD && (
                          <Badge variant="outline" className="text-xs bg-chart-1/10 border-chart-1">
                            <Building2 className="w-3 h-3 mr-1" />
                            R&D ({locationFacilities.filter(f => f.facilityType === "R&D Center").length})
                          </Badge>
                        )}
                        {hasTesting && (
                          <Badge variant="outline" className="text-xs bg-chart-2/10 border-chart-2">
                            <FlaskConical className="w-3 h-3 mr-1" />
                            Testing ({locationFacilities.filter(f => f.facilityType === "Testing & Expansion").length})
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    {locationFacilities.map((facility, idx) => (
                      <div key={idx} className="p-2 rounded-md bg-muted/50">
                        <div className="font-medium">{facility.oem}</div>
                        <div className="text-muted-foreground mt-1">{facility.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </svg>
    </div>
  )
}
