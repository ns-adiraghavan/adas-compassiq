
import { useWaypointData } from "@/hooks/useWaypointData"

interface BusinessModelAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const BusinessModelAnalysis = ({ selectedOEM, selectedCountry }: BusinessModelAnalysisProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  // Return completely empty - no content at all
  return null
}

export default BusinessModelAnalysis
