
import { useState } from "react"
import { VennDiagramData } from "@/utils/vennDiagramUtils"
import VennDiagramSVG from "@/components/VennDiagramSVG"
import VennDiagramLegend from "@/components/VennDiagramLegend"
import VennDiagramStats from "@/components/VennDiagramStats"
import VennDiagramIntersectionDetails from "@/components/VennDiagramIntersectionDetails"
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

  const handleCloseDetails = () => {
    setSelectedIntersection(null)
  }

  if (displayEntities.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 ${theme.textMuted}`}>
        <p>No data available for the selected criteria</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main diagram area */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <VennDiagramSVG
            data={data}
            entities={displayEntities}
            colors={colors}
            onIntersectionSelect={handleIntersectionSelect}
          />
          <VennDiagramLegend
            entities={displayEntities}
            colors={colors}
          />
        </div>
        
        {/* Stats sidebar */}
        <div className="w-80 pl-6">
          <VennDiagramStats data={data} entities={displayEntities} />
        </div>
      </div>

      {/* Intersection details modal */}
      {selectedIntersection && (
        <VennDiagramIntersectionDetails
          intersection={selectedIntersection}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  )
}

export default VennDiagram
