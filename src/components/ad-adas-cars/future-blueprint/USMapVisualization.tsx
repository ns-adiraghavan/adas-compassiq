import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Building2, FlaskConical } from "lucide-react"
import usMapImage from "@/assets/us-map.png"

interface USMapVisualizationProps {
  facilities: FacilityLocation[]
}

// US state positions scaled for percentage-based positioning (0-100 scale)
const statePositions: Record<string, { x: number; y: number; abbr: string }> = {
  "washington": { x: 12, y: 15, abbr: "WA" },
  "oregon": { x: 10, y: 28, abbr: "OR" },
  "california": { x: 8, y: 48, abbr: "CA" },
  "nevada": { x: 16, y: 38, abbr: "NV" },
  "arizona": { x: 20, y: 58, abbr: "AZ" },
  "idaho": { x: 18, y: 22, abbr: "ID" },
  "montana": { x: 25, y: 18, abbr: "MT" },
  "wyoming": { x: 28, y: 30, abbr: "WY" },
  "utah": { x: 24, y: 42, abbr: "UT" },
  "colorado": { x: 32, y: 44, abbr: "CO" },
  "new mexico": { x: 30, y: 60, abbr: "NM" },
  "north dakota": { x: 38, y: 20, abbr: "ND" },
  "south dakota": { x: 40, y: 30, abbr: "SD" },
  "nebraska": { x: 42, y: 40, abbr: "NE" },
  "kansas": { x: 44, y: 48, abbr: "KS" },
  "oklahoma": { x: 46, y: 58, abbr: "OK" },
  "texas": { x: 45, y: 72, abbr: "TX" },
  "minnesota": { x: 48, y: 22, abbr: "MN" },
  "iowa": { x: 50, y: 36, abbr: "IA" },
  "missouri": { x: 52, y: 48, abbr: "MO" },
  "arkansas": { x: 54, y: 60, abbr: "AR" },
  "louisiana": { x: 56, y: 70, abbr: "LA" },
  "wisconsin": { x: 54, y: 28, abbr: "WI" },
  "illinois": { x: 58, y: 42, abbr: "IL" },
  "michigan": { x: 62, y: 30, abbr: "MI" },
  "indiana": { x: 62, y: 44, abbr: "IN" },
  "ohio": { x: 68, y: 42, abbr: "OH" },
  "kentucky": { x: 66, y: 52, abbr: "KY" },
  "tennessee": { x: 64, y: 58, abbr: "TN" },
  "mississippi": { x: 60, y: 66, abbr: "MS" },
  "alabama": { x: 64, y: 66, abbr: "AL" },
  "florida": { x: 72, y: 78, abbr: "FL" },
  "georgia": { x: 70, y: 64, abbr: "GA" },
  "south carolina": { x: 74, y: 60, abbr: "SC" },
  "north carolina": { x: 76, y: 54, abbr: "NC" },
  "virginia": { x: 78, y: 48, abbr: "VA" },
  "west virginia": { x: 72, y: 48, abbr: "WV" },
  "pennsylvania": { x: 78, y: 42, abbr: "PA" },
  "new york": { x: 82, y: 34, abbr: "NY" },
  "vermont": { x: 86, y: 28, abbr: "VT" },
  "new hampshire": { x: 88, y: 30, abbr: "NH" },
  "maine": { x: 90, y: 20, abbr: "ME" },
  "massachusetts": { x: 88, y: 36, abbr: "MA" },
  "rhode island": { x: 90, y: 38, abbr: "RI" },
  "connecticut": { x: 86, y: 40, abbr: "CT" },
  "new jersey": { x: 82, y: 42, abbr: "NJ" },
  "delaware": { x: 80, y: 46, abbr: "DE" },
  "maryland": { x: 78, y: 48, abbr: "MD" },
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

  const totalFacilities = facilities.length
  const rdCount = facilities.filter(f => f.facilityType === "R&D Center").length
  const testingCount = facilities.filter(f => f.facilityType === "Testing").length

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm relative`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Facility Footprint</h3>
        <div className={`text-sm ${theme.textSecondary}`}>
          <span className="font-semibold">{totalFacilities}</span> facilities
          <span className="mx-2">•</span>
          <span className="text-red-400">{rdCount} R&D</span>
          <span className="mx-2">•</span>
          <span className="text-blue-400">{testingCount} Testing</span>
        </div>
      </div>
      
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {/* US Map Background */}
        <img 
          src={usMapImage} 
          alt="US Map" 
          className="absolute inset-0 w-full h-full object-contain opacity-30"
        />
        
        {/* State labels */}
        {Object.entries(statePositions).map(([state, pos]) => (
          <div
            key={state}
            className="absolute text-xs text-slate-400 font-semibold"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
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
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 z-10"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
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
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-25" />
                  </div>
                </div>
              )}

              {/* Testing facility marker */}
              {hasTesting && (
                <div
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 z-10"
                  style={{
                    left: `${pos.x + 3}%`,
                    top: `${pos.y}%`,
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
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
                      <FlaskConical className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-25" />
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
