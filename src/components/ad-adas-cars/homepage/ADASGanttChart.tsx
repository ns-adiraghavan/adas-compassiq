import { useTheme } from "@/contexts/ThemeContext"

interface GanttItem {
  oem: string
  level: string
  year: number
  logo?: string
}

const ADASGanttChart = () => {
  const { theme } = useTheme()

  // Sample data for OEMs across different autonomy levels and years
  const ganttData: GanttItem[] = [
    { oem: "Tesla", level: "Level 4", year: 2024 },
    { oem: "BMW", level: "Level 3", year: 2024 },
    { oem: "Ford", level: "Level 3", year: 2025 },
    { oem: "General Motors", level: "Level 4", year: 2025 },
    { oem: "Rivian", level: "Level 2+", year: 2024 },
    { oem: "Tesla", level: "Level 2+", year: 2023 },
  ]

  const levels = ["Level 4", "Level 3", "Level 2+", "Level 2", "Level 1", "ADAS+", "Foundational ADAS"]
  const years = [2023, 2024, 2025, 2026, 2027, 2028]
  const oems = ["Tesla", "Rivian", "BMW", "General Motors", "Ford"]
  const oemColors: Record<string, string> = {
    "Tesla": "bg-red-500",
    "Rivian": "bg-green-500",
    "BMW": "bg-blue-500",
    "General Motors": "bg-purple-500",
    "Ford": "bg-cyan-500"
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>
        OEM ADAS/Autonomous Driving Roadmap
      </h3>
      <div className="relative overflow-x-auto">
        {/* Gantt Chart Grid */}
        <div className="min-w-[800px]">
          {/* Header - Years */}
          <div className="flex mb-2">
            <div className="w-32 flex-shrink-0" />
            {years.map(year => (
              <div key={year} className="flex-1 text-center">
                <span className={`text-sm font-medium ${theme.textSecondary}`}>{year}</span>
              </div>
            ))}
          </div>

          {/* Grid Lines and Content */}
          {levels.map((level, levelIndex) => (
            <div key={level} className="flex items-center h-12 border-t border-border/20">
              {/* Level Label */}
              <div className="w-32 flex-shrink-0 pr-4">
                <span className={`text-sm font-medium ${theme.textSecondary}`}>{level}</span>
              </div>

              {/* Year Columns */}
              <div className="flex-1 flex relative h-full">
                {years.map((year, yearIndex) => (
                  <div key={year} className="flex-1 border-l border-border/10 relative">
                    {/* Plot OEM items */}
                    {ganttData
                      .filter(item => item.level === level && item.year === year)
                      .map((item, idx) => (
                        <div
                          key={`${item.oem}-${idx}`}
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${oemColors[item.oem]} text-white text-xs px-3 py-1 rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer whitespace-nowrap`}
                        >
                          {item.oem}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <span className={`text-sm ${theme.textMuted}`}>OEMs:</span>
          {oems.map(oem => (
            <div key={oem} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${oemColors[oem]}`} />
              <span className={`text-xs ${theme.textSecondary}`}>{oem}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ADASGanttChart
