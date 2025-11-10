import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Building2, FlaskConical, MapPin, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface AnnouncementsTableProps {
  facilities: FacilityLocation[]
}

const AnnouncementsTable = ({ facilities }: AnnouncementsTableProps) => {
  const [expandedOEMs, setExpandedOEMs] = useState<Set<string>>(new Set())

  const toggleOEM = (oem: string) => {
    setExpandedOEMs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(oem)) {
        newSet.delete(oem)
      } else {
        newSet.add(oem)
      }
      return newSet
    })
  }

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
      <div className="p-6 bg-background/30 backdrop-blur-sm rounded-xl border border-dashed border-border/50">
        <div className="text-center text-muted-foreground">
          No facility data found for this selection
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-background/40 backdrop-blur-md rounded-xl border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] h-full">
      <div className="space-y-4 h-full flex flex-col">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Strategic Insights
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Key facility locations and expansion initiatives
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-background/60 backdrop-blur rounded-lg border border-dashed border-border/40">
          <div className="text-center group cursor-default">
            <div className="text-2xl font-bold text-primary transition-transform group-hover:scale-110 duration-300">{sortedOEMs.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Active OEMs</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-2xl font-bold text-primary transition-transform group-hover:scale-110 duration-300">{facilities.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Facilities</div>
          </div>
        </div>

        {/* OEM insights - Expandable cards */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            {sortedOEMs.map(([oem, data], index) => {
              const isExpanded = expandedOEMs.has(oem)
              const totalFacilities = data.rdCount + data.testingCount
              
              return (
                <Collapsible 
                  key={oem}
                  open={isExpanded}
                  onOpenChange={() => toggleOEM(oem)}
                >
                  <div 
                    className="group bg-background/60 backdrop-blur rounded-lg border border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                  >
                    <CollapsibleTrigger className="w-full p-3 text-left">
                      <div className="flex items-center gap-3">
                        {/* Rank badge with pulse effect for top 3 */}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-all duration-300 ${
                          index < 3 ? 'group-hover:animate-pulse group-hover:shadow-[0_0_12px_rgba(var(--primary),0.4)]' : ''
                        }`}>
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground text-sm">{oem}</span>
                            <Badge variant="secondary" className="text-xs h-5 px-2">
                              {totalFacilities} {totalFacilities === 1 ? 'facility' : 'facilities'}
                            </Badge>
                          </div>
                          
                          {/* Tag indicators with hover glow */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {data.rdCount > 0 && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-chart-1/10 border border-chart-1/20 rounded-md transition-all duration-300 hover:shadow-[0_0_8px_rgba(var(--chart-1),0.3)] hover:border-chart-1/40">
                                <FlaskConical className="w-3 h-3 text-chart-1" />
                                <span className="text-muted-foreground font-medium">{data.rdCount} R&D</span>
                              </div>
                            )}
                            {data.testingCount > 0 && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-chart-2/10 border border-chart-2/20 rounded-md transition-all duration-300 hover:shadow-[0_0_8px_rgba(var(--chart-2),0.3)] hover:border-chart-2/40">
                                <Building2 className="w-3 h-3 text-chart-2" />
                                <span className="text-muted-foreground font-medium">{data.testingCount} Testing</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="animate-accordion-down">
                      <div className="px-3 pb-3 pt-2 space-y-3 border-t border-dashed border-border/40">
                        {/* Locations */}
                        <div className="flex items-start gap-2 text-xs">
                          <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">Locations:</span> {Array.from(data.locations).join(", ")}
                          </div>
                        </div>

                        {/* Facility details */}
                        <div className="space-y-2">
                          {data.facilities.map((facility, idx) => (
                            <div 
                              key={idx} 
                              className="text-xs pl-3 border-l-2 border-primary/30 bg-muted/30 p-2 rounded-r hover:bg-muted/50 transition-colors duration-300"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">{facility.facilityType}</span>
                                <span className="text-muted-foreground">• {facility.location}</span>
                              </div>
                              <div className="text-muted-foreground leading-relaxed">
                                {facility.details}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default AnnouncementsTable
