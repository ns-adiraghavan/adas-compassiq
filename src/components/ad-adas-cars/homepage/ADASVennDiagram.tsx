import { useTheme } from "@/contexts/ThemeContext"

const ADASVennDiagram = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full`}>
      <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>
        Build Strategy Distribution
      </h3>
      
      <div className="flex items-center justify-center h-[400px]">
        <svg viewBox="0 0 400 350" className="w-full h-full">
          {/* In House Circle (Left) */}
          <circle
            cx="140"
            cy="175"
            r="100"
            fill="hsl(var(--primary) / 0.3)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          
          {/* Hybrid Circle (Right) */}
          <circle
            cx="260"
            cy="175"
            r="100"
            fill="hsl(var(--accent) / 0.3)"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
          
          {/* Supplier Circle (Bottom) */}
          <circle
            cx="200"
            cy="240"
            r="100"
            fill="hsl(var(--secondary) / 0.3)"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />

          {/* Labels */}
          <text x="140" y="90" textAnchor="middle" className={`text-sm font-semibold ${theme.textPrimary} fill-current`}>
            In House
          </text>
          <text x="260" y="90" textAnchor="middle" className={`text-sm font-semibold ${theme.textPrimary} fill-current`}>
            Hybrid
          </text>
          <text x="200" y="355" textAnchor="middle" className={`text-sm font-semibold ${theme.textPrimary} fill-current`}>
            Supplier
          </text>

          {/* OEM Logos/Names positioned in different sections */}
          <text x="110" y="160" textAnchor="middle" className={`text-xs font-medium ${theme.textPrimary} fill-current`}>
            Tesla
          </text>
          <text x="110" y="180" textAnchor="middle" className={`text-xs font-medium ${theme.textPrimary} fill-current`}>
            Rivian
          </text>

          <text x="290" y="160" textAnchor="middle" className={`text-xs font-medium ${theme.textPrimary} fill-current`}>
            BMW
          </text>

          <text x="200" y="200" textAnchor="middle" className={`text-xs font-medium ${theme.textPrimary} fill-current`}>
            GM
          </text>

          <text x="170" y="290" textAnchor="middle" className={`text-xs font-medium ${theme.textPrimary} fill-current`}>
            Ford
          </text>

          {/* Counts in unique sections */}
          <text x="70" y="175" textAnchor="middle" className={`text-lg font-bold ${theme.textPrimary} fill-current`}>
            2
          </text>
          <text x="330" y="175" textAnchor="middle" className={`text-lg font-bold ${theme.textPrimary} fill-current`}>
            1
          </text>
          <text x="230" y="310" textAnchor="middle" className={`text-lg font-bold ${theme.textPrimary} fill-current`}>
            1
          </text>

          {/* Intersection counts */}
          <text x="200" y="230" textAnchor="middle" className={`text-lg font-bold ${theme.textPrimary} fill-current`}>
            1
          </text>
        </svg>
      </div>

      <div className={`mt-4 text-center text-xs ${theme.textMuted}`}>
        <p>Distribution of OEM development strategies across build approaches</p>
      </div>
    </div>
  )
}

export default ADASVennDiagram
