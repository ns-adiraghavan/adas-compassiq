
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Loader2, Lightbulb, TrendingUp } from "lucide-react"
import { useDataInsightsAI } from "@/hooks/useDataInsightsAI"

interface DataSnippetsProps {
  selectedOEM: string
  selectedCountry: string
}

const DataSnippets = ({ selectedOEM, selectedCountry }: DataSnippetsProps) => {
  // Only enable insights when an OEM is actually selected OR for market overview
  const { data: aiInsights, isLoading, error } = useDataInsightsAI({
    selectedOEM: selectedOEM || "", // Pass empty string when no OEM selected
    selectedCountry,
    enabled: true // Always enabled to show market insights
  })

  const getTitle = () => {
    if (selectedOEM && selectedOEM.trim() !== "") {
      return `Strategic Insights - ${selectedOEM}`
    }
    return "Market Strategic Insights"
  }

  const getSubtitle = () => {
    if (selectedOEM && selectedOEM.trim() !== "") {
      return `${selectedOEM} • ${selectedCountry || 'Global'} • ${aiInsights?.dataPoints || 0} data points analyzed`
    }
    return `Market Overview • ${selectedCountry || 'Global'} • ${aiInsights?.dataPoints || 0} features analyzed`
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
          <span className="text-white/60">
            {selectedOEM && selectedOEM.trim() !== "" ? 'Analyzing OEM performance...' : 'Analyzing market landscape...'}
          </span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="py-4">
          <p className="text-red-400 text-sm">Unable to generate insights</p>
          <p className="text-white/40 text-xs mt-1">Check data connectivity and try again</p>
        </div>
      )
    }

    if (!aiInsights?.insights?.length) {
      return (
        <div className="py-4">
          <p className="text-white/60 text-sm">No insights available for current selection</p>
          <p className="text-white/40 text-xs mt-1">
            {selectedCountry ? `No data found for ${selectedCountry}` : 'Select a country to view analysis'}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {aiInsights.insights.map((insight: string, index: number) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            {selectedOEM && selectedOEM.trim() !== "" ? (
              <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            ) : (
              <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-white text-sm leading-relaxed flex-1">
              {insight}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          {getTitle()}
        </CardTitle>
        <p className="text-white/60 text-xs">
          {getSubtitle()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default DataSnippets
