import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Building2, FlaskConical } from "lucide-react"

interface USMapVisualizationProps {
  facilities: FacilityLocation[]
}

// Simplified US state positions for a stylized grid layout
const statePositions: Record<string, { x: number; y: number; abbr: string }> = {
  "washington": { x: 50, y: 40, abbr: "WA" },
  "oregon": { x: 50, y: 80, abbr: "OR" },
  "california": { x: 40, y: 140, abbr: "CA" },
  "nevada": { x: 80, y: 100, abbr: "NV" },
  "arizona": { x: 90, y: 160, abbr: "AZ" },
  "idaho": { x: 90, y: 50, abbr: "ID" },
  "montana": { x: 120, y: 30, abbr: "MT" },
  "wyoming": { x: 130, y: 70, abbr: "WY" },
  "utah": { x: 110, y: 110, abbr: "UT" },
  "colorado": { x: 150, y: 110, abbr: "CO" },
  "new mexico": { x: 140, y: 160, abbr: "NM" },
  "north dakota": { x: 180, y: 30, abbr: "ND" },
  "south dakota": { x: 180, y: 70, abbr: "SD" },
  "nebraska": { x: 190, y: 100, abbr: "NE" },
  "kansas": { x: 200, y: 130, abbr: "KS" },
  "oklahoma": { x: 210, y: 160, abbr: "OK" },
  "texas": { x: 210, y: 200, abbr: "TX" },
  "minnesota": { x: 220, y: 50, abbr: "MN" },
  "iowa": { x: 230, y: 90, abbr: "IA" },
  "missouri": { x: 240, y: 130, abbr: "MO" },
  "arkansas": { x: 250, y: 165, abbr: "AR" },
  "louisiana": { x: 260, y: 200, abbr: "LA" },
  "wisconsin": { x: 260, y: 60, abbr: "WI" },
  "illinois": { x: 270, y: 100, abbr: "IL" },
  "michigan": { x: 290, y: 60, abbr: "MI" },
  "indiana": { x: 290, y: 110, abbr: "IN" },
  "ohio": { x: 320, y: 100, abbr: "OH" },
  "kentucky": { x: 310, y: 140, abbr: "KY" },
  "tennessee": { x: 300, y: 165, abbr: "TN" },
  "mississippi": { x: 280, y: 190, abbr: "MS" },
  "alabama": { x: 300, y: 190, abbr: "AL" },
  "florida": { x: 340, y: 220, abbr: "FL" },
  "georgia": { x: 330, y: 180, abbr: "GA" },
  "south carolina": { x: 350, y: 170, abbr: "SC" },
  "north carolina": { x: 360, y: 150, abbr: "NC" },
  "virginia": { x: 370, y: 130, abbr: "VA" },
  "west virginia": { x: 340, y: 120, abbr: "WV" },
  "pennsylvania": { x: 370, y: 100, abbr: "PA" },
  "new york": { x: 390, y: 80, abbr: "NY" },
  "vermont": { x: 410, y: 60, abbr: "VT" },
  "new hampshire": { x: 425, y: 65, abbr: "NH" },
  "maine": { x: 440, y: 40, abbr: "ME" },
  "massachusetts": { x: 430, y: 80, abbr: "MA" },
  "rhode island": { x: 440, y: 85, abbr: "RI" },
  "connecticut": { x: 420, y: 90, abbr: "CT" },
  "new jersey": { x: 400, y: 105, abbr: "NJ" },
  "delaware": { x: 395, y: 120, abbr: "DE" },
  "maryland": { x: 380, y: 125, abbr: "MD" },
}

const USMapVisualization = ({ facilities }: USMapVisualizationProps) => {
  const { theme } = useTheme()
  const [hoveredFacility, setHoveredFacility] = useState<{ facility: FacilityLocation; x: number; y: number } | null>(null)

  // Group facilities by location
  const facilitiesByLocation = facilities.reduce((acc, facility) => {
    const location = facility.location.toLowerCase()
    if (!acc[location]) acc[location] = []
    acc[location].push(facility)
    return acc
  }, {} as Record<string, FacilityLocation[]>)

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm relative`}>
      <h3 className={`text-lg font-bold ${theme.textPrimary} mb-4`}>Facility Footprint</h3>
      
      <div className="relative w-full h-[500px] bg-slate-900/50 rounded-lg overflow-hidden">
        {/* State labels */}
        {Object.entries(statePositions).map(([state, pos]) => (
          <div
            key={state}
            className="absolute text-xs text-slate-600 font-medium"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
            }}
          >
            {pos.abbr}
          </div>
        ))}

        {/* Facility markers */}
        {Object.entries(facilitiesByLocation).map(([location, locationFacilities]) => {
          const pos = statePositions[location]
          if (!pos) return null

          const hasRD = locationFacilities.some(f => f.facilityType === "R&D Center")
          const hasTesting = locationFacilities.some(f => f.facilityType === "Testing")
          
          return (
            <div key={location}>
              {/* R&D Center marker */}
              {hasRD && (
                <div
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125"
                  style={{
                    left: `${pos.x + 5}px`,
                    top: `${pos.y + 15}px`,
                  }}
                  onMouseEnter={(e) => {
                    const facility = locationFacilities.find(f => f.facilityType === "R&D Center")
                    if (facility) {
                      setHoveredFacility({
                        facility,
                        x: e.currentTarget.getBoundingClientRect().left,
                        y: e.currentTarget.getBoundingClientRect().top
                      })
                    }
                  }}
                  onMouseLeave={() => setHoveredFacility(null)}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute inset-0 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-20" />
                  </div>
                </div>
              )}

              {/* Testing facility marker */}
              {hasTesting && (
                <div
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125"
                  style={{
                    left: `${pos.x + 15}px`,
                    top: `${pos.y + 15}px`,
                  }}
                  onMouseEnter={(e) => {
                    const facility = locationFacilities.find(f => f.facilityType === "Testing")
                    if (facility) {
                      setHoveredFacility({
                        facility,
                        x: e.currentTarget.getBoundingClientRect().left,
                        y: e.currentTarget.getBoundingClientRect().top
                      })
                    }
                  }}
                  onMouseLeave={() => setHoveredFacility(null)}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <FlaskConical className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute inset-0 w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-20" />
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Hover tooltip */}
        {hoveredFacility && (
          <div
            className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl max-w-xs pointer-events-none"
            style={{
              left: `${hoveredFacility.x}px`,
              top: `${hoveredFacility.y - 100}px`,
            }}
          >
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">{hoveredFacility.facility.oem}</div>
              <div className="text-xs text-slate-300">{hoveredFacility.facility.location}</div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                hoveredFacility.facility.facilityType === "R&D Center" 
                  ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {hoveredFacility.facility.facilityType}
              </div>
              {hoveredFacility.facility.details && (
                <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-700">
                  {hoveredFacility.facility.details.substring(0, 100)}...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          <span className={theme.textSecondary}>R&D Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
          <span className={theme.textSecondary}>Testing Facility</span>
        </div>
      </div>
    </div>
  )
}

export default USMapVisualization
