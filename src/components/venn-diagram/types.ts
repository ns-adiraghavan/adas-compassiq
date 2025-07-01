
import { EntityFeatureData, VennDiagramData } from "@/utils/vennDiagramUtils"
import { SelectedIntersection } from "@/components/VennDiagram"

export interface VennDiagramSVGProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
  colors: Array<{ fill: string; fillOpacity: string; stroke: string; label: string }>
  onIntersectionSelect: (intersection: SelectedIntersection) => void
}

export interface CirclePosition {
  cx: number
  cy: number
}

export interface IntersectionPosition {
  x: number
  y: number
}
