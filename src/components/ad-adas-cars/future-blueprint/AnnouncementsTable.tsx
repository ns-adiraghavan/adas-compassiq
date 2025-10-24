import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Lightbulb, Calendar } from "lucide-react"

interface AnnouncementsTableProps {
  facilities: FacilityLocation[]
}

const AnnouncementsTable = ({ facilities }: AnnouncementsTableProps) => {
  const { theme } = useTheme()

  // Group facilities by OEM to show strategic insights
  const oemInsights = facilities.reduce((acc, facility) => {
    if (!acc[facility.oem]) {
      acc[facility.oem] = {
        rdCount: 0,
        testingCount: 0,
        locations: new Set<string>(),
        facilities: []
      }
    }
    
    if (facility.facilityType === "R&D Center") {
      acc[facility.oem].rdCount++
    } else {
      acc[facility.oem].testingCount++
    }
    
    acc[facility.oem].locations.add(facility.location)
    acc[facility.oem].facilities.push(facility)
    
    return acc
  }, {} as Record<string, { rdCount: number, testingCount: number, locations: Set<string>, facilities: FacilityLocation[] }>)

  const sortedOEMs = Object.entries(oemInsights)
    .sort(([, a], [, b]) => (b.rdCount + b.testingCount) - (a.rdCount + a.testingCount))
    .slice(0, 8) // Show top 8 OEMs

  if (sortedOEMs.length === 0) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full`}>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className={`w-5 h-5 ${theme.textPrimary}`} />
          <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Strategic Insights</h3>
        </div>
        <p className={`text-sm ${theme.textMuted} text-center py-8`}>
          No facility data found for the selected filters
        </p>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full`}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className={`w-5 h-5 ${theme.textPrimary}`} />
        <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Strategic Insights</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>
            {Object.keys(oemInsights).length}
          </div>
          <div className={`text-xs ${theme.textMuted}`}>Active OEMs</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme.textPrimary}`}>
            {facilities.length}
          </div>
          <div className={`text-xs ${theme.textMuted}`}>Total Facilities</div>
        </div>
      </div>

      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
        {sortedOEMs.map(([oem, data], idx) => (
          <div 
            key={idx}
            className={`p-4 rounded-lg ${theme.cardBackground} border-2 ${theme.cardBorder} hover:border-primary/50 transition-all duration-300`}
          >
            <div className="space-y-3">
              {/* OEM Header */}
              <div className="flex items-start justify-between">
                <h4 className={`font-bold text-base ${theme.textPrimary}`}>{oem}</h4>
                <div className="flex gap-2">
                  {data.rdCount > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-chart-1/20 text-chart-1 font-medium">
                      {data.rdCount} R&D
                    </span>
                  )}
                  {data.testingCount > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                      {data.testingCount} Test/Exp
                    </span>
                  )}
                </div>
              </div>
              
              {/* Geographic Footprint */}
              <div className={`text-xs ${theme.textMuted}`}>
                <span className="font-semibold">Locations:</span> {Array.from(data.locations).join(", ")}
              </div>
              
              {/* Key Details */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                {data.facilities.slice(0, 2).map((fac, facIdx) => (
                  <div key={facIdx} className={`text-xs ${theme.textMuted} leading-relaxed`}>
                    <span className="font-semibold text-foreground">{fac.facilityType}:</span> {fac.details.slice(0, 120)}{fac.details.length > 120 ? "..." : ""}
                  </div>
                ))}
                {data.facilities.length > 2 && (
                  <div className={`text-xs ${theme.textMuted} italic`}>
                    +{data.facilities.length - 2} more facilities...
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementsTable
