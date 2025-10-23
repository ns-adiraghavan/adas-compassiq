import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import usMapImage from "@/assets/us-map.png"

interface USMapProps {
  facilities: FacilityLocation[]
}

const USMap = ({ facilities }: USMapProps) => {
  const { theme } = useTheme()

  // Simple state outlines for visualization
  const statePositions: Record<string, {x: number, y: number}> = {
    "california": {x: 80, y: 200},
    "texas": {x: 320, y: 320},
    "michigan": {x: 480, y: 140},
    "arizona": {x: 180, y: 260},
    "nevada": {x: 120, y: 180},
    "ohio": {x: 500, y: 160},
    "tennessee": {x: 480, y: 240},
    "florida": {x: 580, y: 340},
  }

  // Group facilities by location
  const facilitiesByLocation: Record<string, FacilityLocation[]> = {}
  facilities.forEach(facility => {
    const key = facility.location.toLowerCase()
    if (!facilitiesByLocation[key]) {
      facilitiesByLocation[key] = []
    }
    facilitiesByLocation[key].push(facility)
  })

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-lg font-bold mb-4 ${theme.textPrimary}`}>US Facilities Map</h3>
      <div className="relative w-full">
        <svg viewBox="0 0 700 450" className="w-full h-auto">
          {/* US Map Image */}
          <image
            href={usMapImage}
            x="50"
            y="30"
            width="600"
            height="370"
            opacity="0.6"
            className="mix-blend-multiply dark:mix-blend-screen"
          />

        {/* Facility pins */}
        {Object.entries(facilitiesByLocation).map(([location, locationFacilities]) => {
          const pos = statePositions[location]
          if (!pos) return null

          const facilityTypes = locationFacilities.map(f => f.facilityType)
          const isRnD = facilityTypes.includes("R&D Center")
          const isTesting = facilityTypes.includes("Testing")
          
          return (
            <g key={location}>
              {/* Pin */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill={isRnD && isTesting ? "hsl(var(--primary))" : isRnD ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* Location label */}
              <text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                className="text-xs fill-current"
                fill="hsl(var(--foreground))"
              >
                {location.charAt(0).toUpperCase() + location.slice(1)}
              </text>
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(50, 400)">
          <circle cx="0" cy="0" r="6" fill="hsl(var(--chart-1))" stroke="white" strokeWidth="1.5" />
          <text x="12" y="4" className="text-xs fill-current" fill="hsl(var(--foreground))">R&D Center</text>
          
          <circle cx="90" cy="0" r="6" fill="hsl(var(--chart-2))" stroke="white" strokeWidth="1.5" />
          <text x="102" y="4" className="text-xs fill-current" fill="hsl(var(--foreground))">Testing</text>
          
          <circle cx="170" cy="0" r="6" fill="hsl(var(--primary))" stroke="white" strokeWidth="1.5" />
          <text x="182" y="4" className="text-xs fill-current" fill="hsl(var(--foreground))">Both</text>
        </g>
        </svg>
      </div>
    </div>
  )
}

export default USMap
