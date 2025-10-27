import { Card } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, FlaskConical } from "lucide-react"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import usRndMap from "@/assets/maps/us-rnd.png"
import usTestingMap from "@/assets/maps/us-testing-expansion.png"
import chinaMap from "@/assets/maps/china.png"
import europeMap from "@/assets/maps/europe.png"

interface RegionalMapVisualizationProps {
  facilities: FacilityLocation[]
  region: string
  facilityType?: string
}

// Coordinate mapping for facility locations (percentage-based positioning)
const locationCoordinates: Record<string, Record<string, { x: number; y: number }>> = {
  US: {
    "Palo Alto, CA": { x: 12, y: 58 },
    "California": { x: 15, y: 60 },
    "Mountain View, CA": { x: 13, y: 57 },
    "San Francisco, CA": { x: 11, y: 56 },
    "Dearborn, MI": { x: 70, y: 42 },
    "Detroit, MI": { x: 71, y: 40 },
    "Michigan": { x: 70, y: 41 },
    "Pittsburgh, PA": { x: 77, y: 48 },
    "Pennsylvania": { x: 78, y: 48 },
    "Austin, TX": { x: 52, y: 75 },
    "Texas": { x: 53, y: 73 },
    "Phoenix, AZ": { x: 25, y: 68 },
    "Arizona": { x: 26, y: 67 },
    "Seattle, WA": { x: 10, y: 25 },
    "Washington": { x: 11, y: 26 },
    "Las Vegas, NV": { x: 18, y: 64 },
    "Nevada": { x: 19, y: 63 },
    "Atlanta, GA": { x: 75, y: 68 },
    "Georgia": { x: 76, y: 68 },
    "Indiana": { x: 72, y: 48 },
    "Indianapolis, IN": { x: 72, y: 49 },
    "Ohio": { x: 74, y: 47 },
    "Columbus, OH": { x: 74, y: 48 },
    "North Carolina": { x: 79, y: 63 },
    "Charlotte, NC": { x: 79, y: 64 },
    "Tennessee": { x: 73, y: 62 },
    "Nashville, TN": { x: 73, y: 62 },
  },
  Europe: {
    "Munich, Germany": { x: 52, y: 52 },
    "Germany": { x: 52, y: 50 },
    "Stuttgart, Germany": { x: 50, y: 53 },
    "Ingolstadt, Germany": { x: 53, y: 51 },
    "Arjeplog, Sweden": { x: 55, y: 15 },
    "Sweden": { x: 56, y: 30 },
    "Miramas, France": { x: 42, y: 58 },
    "France": { x: 40, y: 52 },
    "Paris, France": { x: 40, y: 48 },
    "United Kingdom": { x: 30, y: 42 },
    "Coventry, UK": { x: 30, y: 43 },
    "Italy": { x: 50, y: 62 },
    "Turin, Italy": { x: 48, y: 60 },
    "Spain": { x: 28, y: 68 },
    "Barcelona, Spain": { x: 32, y: 66 },
    "Netherlands": { x: 42, y: 43 },
    "Helmond, Netherlands": { x: 43, y: 43 },
    "Czech Republic": { x: 56, y: 50 },
    "Prague, Czech Republic": { x: 56, y: 51 },
  },
  China: {
    "Beijing": { x: 70, y: 35 },
    "Shanghai": { x: 75, y: 52 },
    "Shenzhen": { x: 68, y: 75 },
    "Guangzhou": { x: 67, y: 73 },
    "Chengdu": { x: 50, y: 52 },
    "Wuhan": { x: 68, y: 52 },
    "Chongqing": { x: 55, y: 55 },
    "Nanjing": { x: 73, y: 50 },
    "Hangzhou": { x: 75, y: 53 },
    "Suzhou": { x: 76, y: 50 },
  },
}

const getLocationCoordinates = (location: string, region: string): { x: number; y: number } | null => {
  const regionMap = locationCoordinates[region]
  if (!regionMap) return null
  
  // Try exact match first
  if (regionMap[location]) return regionMap[location]
  
  // Try partial match (e.g., "Dearborn" matches "Dearborn, MI")
  const partialMatch = Object.keys(regionMap).find(key => 
    key.toLowerCase().includes(location.toLowerCase()) || 
    location.toLowerCase().includes(key.toLowerCase())
  )
  
  return partialMatch ? regionMap[partialMatch] : null
}

const RegionalMapVisualization = ({ facilities, region, facilityType }: RegionalMapVisualizationProps) => {
  // Separate facilities by type
  const rdFacilities = facilities.filter(f => f.facilityType === "R&D Center")
  const testingFacilities = facilities.filter(f => f.facilityType === "Testing & Expansion")
  
  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    const location = facility.location
    if (!acc[location]) {
      acc[location] = []
    }
    acc[location].push(facility)
    return acc
  }, {} as Record<string, FacilityLocation[]>)

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

      {/* Map Visualization with Interactive Markers */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          {region} Facility Distribution
        </h3>
        <div className="relative w-full aspect-[16/10] bg-muted/20 rounded-lg overflow-hidden">
          <img 
            src={getMapImage()} 
            alt={`${region} Facility Map`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
          
          {/* Interactive Location Markers */}
          {Object.entries(facilitiesByLocation).map(([location, locationFacilities]) => {
            const coordinates = getLocationCoordinates(location, region)
            if (!coordinates) return null
            
            const rdCount = locationFacilities.filter(f => f.facilityType === "R&D Center").length
            const testingCount = locationFacilities.filter(f => f.facilityType === "Testing & Expansion").length
            const totalCount = locationFacilities.length
            const primaryType = rdCount > testingCount ? "R&D Center" : "Testing & Expansion"
            const oems = [...new Set(locationFacilities.map(f => f.oem))].filter(Boolean)
            
            return (
              <HoverCard key={location} openDelay={200}>
                <HoverCardTrigger asChild>
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}
                  >
                    <div className="relative">
                      {/* Pulsing ring animation */}
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                        primaryType === "R&D Center" ? "bg-chart-1" : "bg-chart-2"
                      }`} style={{ animationDuration: '3s' }} />
                      
                      {/* Main marker */}
                      <div className={`relative rounded-full p-2.5 shadow-xl transition-all group-hover:scale-125 ${
                        primaryType === "R&D Center" 
                          ? "bg-chart-1 border-3 border-white" 
                          : "bg-chart-2 border-3 border-white"
                      }`}>
                        {primaryType === "R&D Center" ? (
                          <FlaskConical className="w-5 h-5 text-white" />
                        ) : (
                          <Building2 className="w-5 h-5 text-white" />
                        )}
                        
                        {/* Count badge */}
                        {totalCount > 1 && (
                          <Badge 
                            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold bg-background border-2 border-current shadow-lg"
                          >
                            {totalCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </HoverCardTrigger>
                
                <HoverCardContent className="w-80 p-4" side="top">
                  <div className="space-y-3">
                    {/* Location header */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{location}</h4>
                        <p className="text-sm text-muted-foreground">
                          {totalCount} {totalCount === 1 ? 'facility' : 'facilities'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Facility breakdown */}
                    <div className="space-y-2">
                      {rdCount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <FlaskConical className="w-4 h-4 text-chart-1" />
                          <span className="text-muted-foreground">
                            {rdCount} R&D {rdCount === 1 ? 'Center' : 'Centers'}
                          </span>
                        </div>
                      )}
                      {testingCount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-chart-2" />
                          <span className="text-muted-foreground">
                            {testingCount} Testing & Expansion {testingCount === 1 ? 'Facility' : 'Facilities'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* OEMs */}
                    {oems.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">OEMs:</p>
                        <div className="flex flex-wrap gap-1">
                          {oems.map(oem => (
                            <Badge key={oem} variant="outline" className="text-xs">
                              {oem}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Details */}
                    {locationFacilities.some(f => f.details) && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Details:</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {locationFacilities.filter(f => f.details).map((facility, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground line-clamp-2">
                              • {facility.details}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          })}
          
          {/* Legend overlay positioned on the map */}
          <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-xl max-w-xs z-20">
            <div className="text-sm font-semibold mb-3 text-foreground">Legend</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-chart-1 border-2 border-white flex items-center justify-center shadow-md">
                  <FlaskConical className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">R&D Centers</div>
                  <div>{rdFacilities.length} facilities</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-chart-2 border-2 border-white flex items-center justify-center shadow-md">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">Testing & Expansion</div>
                  <div>{testingFacilities.length} facilities</div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              Hover over markers for details
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RegionalMapVisualization
