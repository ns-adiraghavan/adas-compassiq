import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, FlaskConical } from "lucide-react"

interface ChinaMapSVGProps {
  facilities: FacilityLocation[]
}

// Coordinate mapping for Chinese cities to SVG coordinates
const cityCoordinates: { [key: string]: { x: number; y: number } } = {
  "Beijing": { x: 580, y: 280 },
  "Shanghai": { x: 650, y: 400 },
  "Shenzhen": { x: 600, y: 520 },
  "Guangzhou": { x: 590, y: 510 },
  "Chengdu": { x: 440, y: 400 },
  "Chongqing": { x: 480, y: 410 },
  "Wuhan": { x: 580, y: 400 },
  "Hangzhou": { x: 650, y: 410 },
  "Nanjing": { x: 640, y: 380 },
  "Xi'an": { x: 500, y: 360 },
  "Tianjin": { x: 590, y: 290 },
  "Suzhou": { x: 655, y: 390 },
  "Changsha": { x: 590, y: 440 },
  "Hefei": { x: 630, y: 390 },
  "Dalian": { x: 630, y: 270 },
  "Qingdao": { x: 640, y: 340 },
  "Ningbo": { x: 665, y: 415 },
  "Foshan": { x: 585, y: 515 },
}

// Province paths for coloring (simplified)
const provincePaths = {
  "Beijing": "M560,260 L600,255 L605,295 L565,300 Z",
  "Shanghai": "M635,385 L670,380 L675,420 L640,425 Z",
  "Guangdong": "M560,490 L630,485 L640,540 L570,545 Z",
  "Sichuan": "M400,370 L480,365 L490,440 L410,445 Z",
  "Hubei": "M560,380 L620,375 L625,425 L565,430 Z",
  "Zhejiang": "M630,390 L680,385 L690,435 L640,440 Z",
  "Jiangsu": "M620,360 L670,355 L675,400 L625,405 Z",
  "Shaanxi": "M470,330 L530,325 L540,390 L480,395 Z",
  "Liaoning": "M600,240 L660,235 L670,290 L610,295 Z",
  "Shandong": "M600,310 L670,305 L680,360 L610,365 Z",
}

export const ChinaMapSVG = ({ facilities }: ChinaMapSVGProps) => {
  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    const key = facility.location
    if (!acc[key]) acc[key] = []
    acc[key].push(facility)
    return acc
  }, {} as { [key: string]: FacilityLocation[] })

  // Determine province colors based on facility types
  const getProvinceColor = (province: string) => {
    const provinceFacilities = facilities.filter(f => f.location.includes(province))
    if (provinceFacilities.length === 0) return "hsl(var(--muted))"
    
    const hasRD = provinceFacilities.some(f => f.facilityType === "R&D Center")
    const hasTesting = provinceFacilities.some(f => f.facilityType === "Testing & Expansion")
    
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
        {/* Draw provinces */}
        {Object.entries(provincePaths).map(([province, path]) => (
          <path
            key={province}
            d={path}
            fill={getProvinceColor(province)}
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
