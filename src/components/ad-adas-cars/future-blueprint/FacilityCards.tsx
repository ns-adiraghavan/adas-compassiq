import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Building2, MapPin } from "lucide-react"

interface FacilityCardsProps {
  facilities: FacilityLocation[]
  title: string
  facilityType: "R&D Center" | "Testing"
}

const FacilityCards = ({ facilities, title, facilityType }: FacilityCardsProps) => {
  const { theme } = useTheme()

  const filteredFacilities = facilities.filter(f => f.facilityType === facilityType)

  const getColorClass = (type: string) => {
    if (type === "R&D Center") return "bg-chart-1/20 text-chart-1 border-chart-1/30"
    if (type === "Testing") return "bg-chart-2/20 text-chart-2 border-chart-2/30"
    return "bg-primary/20 text-primary border-primary/30"
  }

  if (filteredFacilities.length === 0) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className={`w-5 h-5 ${theme.textPrimary}`} />
          <h3 className={`text-lg font-bold ${theme.textPrimary}`}>{title}</h3>
        </div>
        <p className={`text-sm ${theme.textMuted} text-center py-8`}>
          No {facilityType.toLowerCase()}s found for the selected filters
        </p>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Building2 className={`w-5 h-5 ${theme.textPrimary}`} />
        <h3 className={`text-lg font-bold ${theme.textPrimary}`}>{title}</h3>
        <span className={`ml-auto text-sm px-3 py-1 rounded-full ${getColorClass(facilityType)} border font-medium`}>
          {filteredFacilities.length} {filteredFacilities.length === 1 ? 'Facility' : 'Facilities'}
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredFacilities.map((facility, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-lg ${theme.cardBackground} border ${theme.cardBorder} hover:border-primary/50 transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold text-lg ${theme.textPrimary}`}>{facility.oem}</span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getColorClass(facility.facilityType)} font-medium`}>
                    {facility.facilityType}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className={`w-4 h-4 ${theme.textMuted}`} />
                  <span className={`text-sm font-medium ${theme.textSecondary}`}>
                    {facility.location}
                  </span>
                </div>
                
                {facility.details && (
                  <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
                    {facility.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FacilityCards
