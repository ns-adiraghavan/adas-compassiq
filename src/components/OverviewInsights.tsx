
import { Card } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-700/50 p-6 h-32">
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Return completely empty div - no content at all
  return <div></div>
}

export default OverviewInsights
