
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Loader2, Lightbulb } from "lucide-react"
import { useDataInsightsAI } from "@/hooks/useDataInsightsAI"

interface DataSnippetsProps {
  selectedOEM: string
  selectedCountry: string
}

const DataSnippets = ({ selectedOEM, selectedCountry }: DataSnippetsProps) => {
  const { data: aiInsights, isLoading, error } = useDataInsightsAI({
    selectedOEM,
    selectedCountry,
    enabled: !!selectedOEM
  })

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400 mr-2" />
          <span className="text-white/60">Generating strategic insights...</span>
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
          <p className="text-white/40 text-xs mt-1">Select an OEM to view strategic analysis</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {aiInsights.insights.map((insight: string, index: number) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
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
          Strategic Insights - AI Analysis
        </CardTitle>
        {selectedOEM && (
          <p className="text-white/60 text-xs">
            {selectedOEM} • {selectedCountry || 'Global'} • {aiInsights?.dataPoints || 0} data points analyzed
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {renderContent()}
      </CardContent>
    </Card>
  )
}

export default DataSnippets
