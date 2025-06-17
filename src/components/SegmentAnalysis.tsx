
import { useWaypointData } from "@/hooks/useWaypointData"

interface SegmentAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const SegmentAnalysis = ({ selectedOEM, selectedCountry }: SegmentAnalysisProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  // Return completely empty - no content at all
  return null
}

export default SegmentAnalysis
