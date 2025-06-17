
import { useWaypointData } from "@/hooks/useWaypointData"

interface EnhancedOverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const EnhancedOverviewInsights = ({ selectedOEM, selectedCountry }: EnhancedOverviewInsightsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  // Return completely empty - no loading state, no content at all
  return null
}

export default EnhancedOverviewInsights
