
import { useState } from "react"
import { VennDiagramData } from "@/utils/vennDiagramUtils"
import VennDiagramSVG from "@/components/VennDiagramSVG"
import VennDiagramLegend from "@/components/VennDiagramLegend"
import VennDiagramStats from "@/components/VennDiagramStats"
import VennDiagramTable from "@/components/VennDiagramTable"
import { useTheme } from "@/contexts/ThemeContext"

interface VennDiagramProps {
  data: VennDiagramData
}

export type IntersectionType = 'unique' | 'pairwise' | 'threeway'

export interface SelectedIntersection {
  type: IntersectionType
  entities: string[]
  features: string[]
}

const VennDiagram = ({ data }: VennDiagramProps) => {
  const { theme } = useTheme()
  const [selectedIntersection, setSelectedIntersection] = useState<SelectedIntersection | null>(null)

  // Limit to first 3 entities
  const displayEntities = data.entities.slice(0, 3)

  // Color configuration
  const colors = [
    { fill: '#3B82F6', fillOpacity: '0.3', stroke: '#1D4ED8', label: '#1D4ED8' },
    { fill: '#EF4444', fillOpacity: '0.3', stroke: '#DC2626', label: '#DC2626' },
    { fill: '#10B981', fillOpacity: '0.3', stroke: '#059669', label: '#059669' }
  ]

  const handleIntersectionSelect = (intersection: SelectedIntersection) => {
    setSelectedIntersection(intersection)
  }

  if (displayEntities.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 ${theme.textMuted}`}>
        <p>No data available for the selected criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top section with legend and stats */}
      <div className="flex gap-6">
        {/* Legend */}
        <div className="flex-shrink-0">
          <VennDiagramLegend
            entities={displayEntities}
            colors={colors}
          />
        </div>
        
        {/* Stats boxes */}
        <div className="flex-1">
          <VennDiagramStats data={data} entities={displayEntities} />
        </div>
      </div>

      {/* Main diagram area */}
      <div className="w-full">
        <VennDiagramSVG
          data={data}
          entities={displayEntities}
          colors={colors}
          onIntersectionSelect={handleIntersectionSelect}
        />
      </div>

      {/* Feature Distribution Table */}
      <VennDiagramTable
        data={data}
        entities={displayEntities}
        selectedIntersection={selectedIntersection}
      />
    </div>
  )
}

export default VennDiagram
