import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, FlaskConical } from "lucide-react"

interface EuropeMapSVGProps {
  facilities: FacilityLocation[]
}

// Coordinate mapping for European cities to SVG coordinates
const cityCoordinates: { [key: string]: { x: number; y: number } } = {
  "Munich": { x: 520, y: 320 },
  "Stuttgart": { x: 500, y: 330 },
  "Ingolstadt": { x: 530, y: 310 },
  "Wolfsburg": { x: 520, y: 260 },
  "Berlin": { x: 560, y: 240 },
  "Hamburg": { x: 510, y: 220 },
  "Paris": { x: 420, y: 320 },
  "London": { x: 380, y: 270 },
  "Amsterdam": { x: 460, y: 240 },
  "Brussels": { x: 450, y: 270 },
  "Zurich": { x: 490, y: 350 },
  "Milan": { x: 500, y: 380 },
  "Rome": { x: 540, y: 450 },
  "Barcelona": { x: 410, y: 450 },
  "Madrid": { x: 360, y: 420 },
  "Stockholm": { x: 580, y: 150 },
  "Oslo": { x: 520, y: 140 },
  "Copenhagen": { x: 540, y: 200 },
  "Vienna": { x: 570, y: 330 },
  "Prague": { x: 560, y: 300 },
  "Warsaw": { x: 630, y: 260 },
  "Budapest": { x: 620, y: 350 },
}

// Country paths for coloring
const countryPaths = {
  "Germany": "M480,230 L560,225 L575,270 L570,320 L540,340 L490,335 L475,290 Z",
  "France": "M380,270 L450,265 L465,310 L460,380 L400,400 L365,350 Z",
  "UK": "M350,230 L400,225 L405,285 L385,295 L345,280 Z",
  "Italy": "M500,360 L540,355 L560,420 L555,480 L510,490 L495,430 Z",
  "Spain": "M320,390 L420,385 L430,465 L340,475 Z",
  "Sweden": "M540,100 L600,95 L610,180 L545,185 Z",
  "Poland": "M590,240 L660,235 L670,290 L595,295 Z",
  "Netherlands": "M440,220 L480,215 L485,255 L445,260 Z",
  "Belgium": "M430,250 L470,245 L475,280 L435,285 Z",
  "Switzerland": "M475,330 L510,325 L515,365 L480,370 Z",
  "Austria": "M540,310 L590,305 L595,345 L545,350 Z",
  "Czech Republic": "M540,280 L580,275 L585,310 L545,315 Z",
}

export const EuropeMapSVG = ({ facilities }: EuropeMapSVGProps) => {
  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    const key = facility.location
    if (!acc[key]) acc[key] = []
    acc[key].push(facility)
    return acc
  }, {} as { [key: string]: FacilityLocation[] })

  // Determine country colors based on facility types
  const getCountryColor = (country: string) => {
    const countryFacilities = facilities.filter(f => f.location.includes(country))
    if (countryFacilities.length === 0) return "hsl(var(--muted))"
    
    const hasRD = countryFacilities.some(f => f.facilityType === "R&D Center")
    const hasTesting = countryFacilities.some(f => f.facilityType === "Testing & Expansion")
    
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
        {/* Draw countries */}
        {Object.entries(countryPaths).map(([country, path]) => (
          <path
            key={country}
            d={path}
            fill={getCountryColor(country)}
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
