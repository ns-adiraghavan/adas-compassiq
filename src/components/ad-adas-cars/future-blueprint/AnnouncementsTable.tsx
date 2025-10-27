import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Building2, FlaskConical, MapPin } from "lucide-react"

interface AnnouncementsTableProps {
  facilities: FacilityLocation[]
}

const AnnouncementsTable = ({ facilities }: AnnouncementsTableProps) => {
  // Group facilities by OEM
  const oemGroups = facilities.reduce((acc, facility) => {
    const oem = facility.oem
    if (!acc[oem]) {
      acc[oem] = {
        rdCount: 0,
        testingCount: 0,
        locations: new Set<string>(),
        facilities: []
      }
    }
    
    if (facility.facilityType === "R&D Center") {
      acc[oem].rdCount++
    } else {
      acc[oem].testingCount++
    }
    
    acc[oem].locations.add(facility.location)
    acc[oem].facilities.push(facility)
    
    return acc
  }, {} as Record<string, {
    rdCount: number
    testingCount: number
    locations: Set<string>
    facilities: FacilityLocation[]
  }>)

  // Sort OEMs by total facilities
  const sortedOEMs = Object.entries(oemGroups)
    .sort(([, a], [, b]) => (b.rdCount + b.testingCount) - (a.rdCount + a.testingCount))
    .slice(0, 10)

  if (sortedOEMs.length === 0) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="text-center text-muted-foreground">
          No facility data found for this selection
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 h-full">
      <div className="space-y-4 h-full flex flex-col">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Strategic Insights
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Key facility locations and expansion initiatives
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-background/80 backdrop-blur rounded-lg border border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{sortedOEMs.length}</div>
            <div className="text-xs text-muted-foreground">Active OEMs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{facilities.length}</div>
            <div className="text-xs text-muted-foreground">Total Facilities</div>
          </div>
        </div>

        {/* OEM insights */}
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
            {sortedOEMs.map(([oem, data], index) => (
              <div 
                key={oem}
                className="p-4 bg-background/80 backdrop-blur rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="font-semibold text-foreground">{oem}</div>
                    
                    <div className="flex flex-wrap gap-3 text-xs">
                      {data.rdCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-chart-1/10 border border-chart-1/20 rounded-md">
                          <FlaskConical className="w-3 h-3 text-chart-1" />
                          <span className="text-muted-foreground font-medium">{data.rdCount} R&D</span>
                        </div>
                      )}
                      {data.testingCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-chart-2/10 border border-chart-2/20 rounded-md">
                          <Building2 className="w-3 h-3 text-chart-2" />
                          <span className="text-muted-foreground font-medium">{data.testingCount} Testing</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-muted-foreground">
                        <span className="font-medium text-foreground">Locations:</span> {Array.from(data.locations).join(", ")}
                      </div>
                    </div>

                    {/* Key details */}
                    <div className="space-y-2">
                      {data.facilities.slice(0, 2).map((facility, idx) => (
                        <div key={idx} className="text-xs pl-3 border-l-2 border-primary/30 bg-muted/30 p-2 rounded-r">
                          <div className="font-medium text-foreground mb-1">{facility.facilityType}</div>
                          <div className="text-muted-foreground leading-relaxed line-clamp-2">
                            {facility.details}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}

export default AnnouncementsTable
