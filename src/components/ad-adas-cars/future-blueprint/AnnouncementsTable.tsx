import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import { Megaphone, Calendar } from "lucide-react"

interface AnnouncementsTableProps {
  facilities: FacilityLocation[]
}

const AnnouncementsTable = ({ facilities }: AnnouncementsTableProps) => {
  const { theme } = useTheme()

  // Filter for expansion/announcement type facilities or all if we want to show everything
  const announcements = facilities.filter(f => 
    f.details && f.details.length > 0
  ).slice(0, 10) // Show top 10 announcements

  if (announcements.length === 0) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className={`w-5 h-5 ${theme.textPrimary}`} />
          <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Key Insights & Announcements</h3>
        </div>
        <p className={`text-sm ${theme.textMuted} text-center py-8`}>
          No announcements found for the selected filters
        </p>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className={`w-5 h-5 ${theme.textPrimary}`} />
        <h3 className={`text-lg font-bold ${theme.textPrimary}`}>Key Insights & Announcements</h3>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {announcements.map((announcement, idx) => (
          <div 
            key={idx}
            className={`p-4 rounded-lg ${theme.cardBackground} border ${theme.cardBorder} hover:border-primary/50 transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                announcement.facilityType === "R&D Center" 
                  ? "bg-chart-1" 
                  : announcement.facilityType === "Testing"
                  ? "bg-chart-2"
                  : "bg-primary"
              }`} />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`font-bold ${theme.textPrimary}`}>{announcement.oem}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme.cardBorder} border ${theme.textMuted}`}>
                    {announcement.facilityType}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Calendar className="w-3 h-3" />
                    <span>Recent</span>
                  </div>
                </div>
                
                <p className={`text-sm ${theme.textSecondary} mb-1`}>
                  <span className="font-medium">Location:</span> {announcement.location}
                </p>
                
                <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
                  {announcement.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementsTable
