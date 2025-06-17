
import { useWaypointData } from "@/hooks/useWaypointData"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  // Return completely empty - no loading state, no content at all
  return null
}

export default OverviewInsights
