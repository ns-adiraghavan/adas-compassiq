
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Loader2 } from "lucide-react"
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
          <span className="text-white/60">Generating AI insights...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="py-4">
          <p className="text-red-400 text-sm">Unable to generate insights</p>
        </div>
      )
    }

    if (!aiInsights?.insights?.length) {
      return (
        <div className="py-4">
          <p className="text-white/60 text-sm">No insights available for current selection</p>
        </div>
      )
    }

    return (
      <ul className="space-y-3 list-disc list-inside pl-2">
        {aiInsights.insights.map((insight: string, index: number) => (
          <li key={index} className="text-white text-sm break-words leading-relaxed">
            {insight}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Data Insights - From AI
        </CardTitle>
        {selectedOEM && (
          <p className="text-white/60 text-xs">
            {selectedOEM} • {selectedCountry || 'Global'} • {aiInsights?.dataPoints || 0} data points
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
