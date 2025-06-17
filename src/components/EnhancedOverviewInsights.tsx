
import { Card } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { TrendingUp, Globe, Zap, Database } from "lucide-react"

interface EnhancedOverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const EnhancedOverviewInsights = ({ selectedOEM, selectedCountry }: EnhancedOverviewInsightsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-700/50 p-6 h-48">
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-32 bg-gray-800 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!selectedOEM) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/30 p-8 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Database className="h-12 w-12 text-gray-400" />
          <h3 className="text-xl font-light text-white mb-2">Select an OEM to Begin</h3>
          <p className="text-gray-400 font-light max-w-md">
            Choose an automotive manufacturer from the selection above to view detailed market intelligence and analytics.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Current Selection Display */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-4">Current Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-white/60 text-sm">Selected OEM</p>
              <p className="text-white font-medium">{selectedOEM}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-white/60 text-sm">Selected Region</p>
              <p className="text-white font-medium">{selectedCountry}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats Section - Placeholder */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Zap className="h-12 w-12 text-gray-400" />
          <h3 className="text-xl font-light text-white mb-2">Summary Statistics</h3>
          <p className="text-gray-400 font-light">This section will show key metrics and statistics</p>
        </div>
      </Card>

      {/* Charts Section - Placeholder */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Database className="h-12 w-12 text-gray-400" />
          <h3 className="text-xl font-light text-white mb-2">Data Visualization</h3>
          <p className="text-gray-400 font-light">Charts and graphs will be displayed here</p>
        </div>
      </Card>

      {/* Analysis Section - Placeholder */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <TrendingUp className="h-12 w-12 text-gray-400" />
          <h3 className="text-xl font-light text-white mb-2">Detailed Analysis</h3>
          <p className="text-gray-400 font-light">In-depth analysis and insights will appear here</p>
        </div>
      </Card>
    </div>
  )
}

export default EnhancedOverviewInsights
