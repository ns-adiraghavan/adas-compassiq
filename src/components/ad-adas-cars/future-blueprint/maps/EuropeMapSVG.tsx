import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface EuropeMapSVGProps {
  facilities: FacilityLocation[]
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Map city locations to [longitude, latitude] coordinates
const cityCoordinates: Record<string, [number, number]> = {
  // Germany
  "Munich, Germany": [11.5820, 48.1351],
  "Ingolstadt, Germany": [11.4250, 48.7665],
  "Stuttgart, Germany": [9.1829, 48.7758],
  "Wolfsburg, Germany": [10.7872, 52.4227],
  "Berlin, Germany": [13.4050, 52.5200],
  "Unterschleißheim, Germany": [11.5744, 48.2839],
  // Sweden
  "Arjeplog, Sweden": [17.8333, 66.0500],
  // France
  "Miramas, France": [5.0000, 43.5833],
  "Rodez, France": [2.5750, 44.3500],
  // UK
  "Coventry, UK": [-1.5080, 52.4068],
  // Spain
  "Barcelona, Spain": [2.1734, 41.3851],
  "Tarragona, Spain": [1.2445, 41.1189],
  // Netherlands
  "Tilburg, Netherlands": [5.0913, 51.5555],
  // Czech Republic
  "Sokolov, Czech Republic": [12.6400, 50.1814],
  // Serbia
  "Belgrade, Serbia,Europe": [20.4489, 44.7866],
}

// Map locations to country names for coloring
const locationToCountry: Record<string, string> = {
  // Germany
  "Munich, Germany": "Germany",
  "Ingolstadt, Germany": "Germany",
  "Stuttgart, Germany": "Germany",
  "Wolfsburg, Germany": "Germany",
  "Berlin, Germany": "Germany",
  "Unterschleißheim, Germany": "Germany",
  // Sweden
  "Arjeplog, Sweden": "Sweden",
  // France
  "Miramas, France": "France",
  "Rodez, France": "France",
  // UK
  "Coventry, UK": "United Kingdom",
  // Spain
  "Barcelona, Spain": "Spain",
  "Tarragona, Spain": "Spain",
  // Netherlands
  "Tilburg, Netherlands": "Netherlands",
  // Czech Republic
  "Sokolov, Czech Republic": "Czech Republic",
  // Serbia
  "Belgrade, Serbia,Europe": "Serbia",
}

export const EuropeMapSVG = ({ facilities }: EuropeMapSVGProps) => {
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

  // Determine country colors based on facility types - improved contrast
  const getCountryColor = (countryName: string) => {
    const countryFacilities = facilities.filter(f => locationToCountry[f.location] === countryName)
    if (countryFacilities.length === 0) return "hsl(var(--muted) / 0.3)"
    
    const hasRD = countryFacilities.some(f => f.facilityType === "R&D Center")
    const hasTesting = countryFacilities.some(f => f.facilityType === "Testing & Expansion")
    
    if (hasRD && hasTesting) return "hsl(var(--chart-3) / 0.8)"
    if (hasRD) return "hsl(var(--chart-1) / 0.8)"
    if (hasTesting) return "hsl(var(--chart-2) / 0.8)"
    return "hsl(var(--muted) / 0.3)"
  }

  return (
    <ComposableMap
      projection="geoMercator"
      className="w-full h-full"
      projectionConfig={{
        center: [10, 53],
        scale: 600,
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies
            .filter(geo => {
              // Filter to show only European countries
              const europeanCountries = [
                "Germany", "France", "United Kingdom", "Spain", "Italy", "Sweden",
                "Norway", "Finland", "Denmark", "Poland", "Netherlands", "Belgium",
                "Austria", "Switzerland", "Portugal", "Greece", "Czech Republic",
                "Romania", "Hungary", "Ireland", "Slovakia", "Bulgaria", "Croatia",
                "Serbia"
              ]
              return europeanCountries.includes(geo.properties.name)
            })
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getCountryColor(geo.properties.name)}
                stroke="hsl(var(--foreground) / 0.2)"
                strokeWidth={0.8}
                style={{
                  default: { outline: "none" },
                  hover: { fill: getCountryColor(geo.properties.name), opacity: 0.9, outline: "none", filter: "brightness(1.1)" },
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
