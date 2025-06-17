
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, Lightbulb } from "lucide-react"
import { useMemo } from "react"

interface MarketIntelligenceProps {
  selectedOEM: string
  selectedCountry: string
  contextData: any[]
}

const MarketIntelligence = ({ selectedOEM, selectedCountry, contextData }: MarketIntelligenceProps) => {
  const insights = useMemo(() => {
    // Extract relevant insights from document analysis
    const relevantContext = contextData.find(ctx => 
      ctx.data_summary?.analysis?.summary?.toLowerCase().includes('automotive') ||
      ctx.data_summary?.analysis?.insights?.some((insight: string) => 
        insight.toLowerCase().includes('automotive') || 
        insight.toLowerCase().includes('connected') ||
        insight.toLowerCase().includes('vehicle')
      )
    )

    if (relevantContext?.data_summary?.analysis) {
      return relevantContext.data_summary.analysis
    }

    // Fallback insights based on general automotive trends
    return {
      insights: [
        "Connected services adoption is accelerating across all market segments",
        "Subscription-based business models are becoming the dominant revenue strategy",
        "Safety and maintenance features show highest consumer demand",
        "Over-the-air updates are becoming standard across premium segments"
      ],
      recommended_metrics: [
        "Feature adoption rates",
        "Market penetration by segment",
        "Customer lifetime value",
        "Service platform utilization"
      ],
      correlation_analysis: `${selectedOEM} is positioned in the competitive connected services landscape with focus on comprehensive feature offerings.`
    }
  }, [contextData, selectedOEM])

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-600/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-blue-200 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Market Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Insights */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-blue-300 mb-3">
            <Lightbulb className="h-4 w-4 mr-2" />
            Industry Insights
          </h4>
          <div className="space-y-2">
            {insights.insights?.slice(0, 4).map((insight: string, index: number) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                <p className="text-blue-100/80 text-sm leading-relaxed">{insight}</p>
              </div>
            )) || (
              <p className="text-blue-100/60 text-sm italic">
                No specific industry insights available in the current context.
              </p>
            )}
          </div>
        </div>

        {/* Competitive Position */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-blue-300 mb-3">
            <Target className="h-4 w-4 mr-2" />
            Competitive Position
          </h4>
          <p className="text-blue-100/80 text-sm leading-relaxed">
            {insights.correlation_analysis || 
             `${selectedOEM} demonstrates competitive positioning in the connected services market with comprehensive feature coverage across multiple segments and regions.`
            }
          </p>
        </div>

        {/* Recommended Metrics */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-blue-300 mb-3">
            <Users className="h-4 w-4 mr-2" />
            Key Performance Indicators
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {insights.recommended_metrics?.slice(0, 4).map((metric: string, index: number) => (
              <div 
                key={index}
                className="bg-blue-600/10 border border-blue-600/20 rounded px-3 py-2"
              >
                <div className="text-blue-200 text-xs font-medium">{metric}</div>
              </div>
            )) || (
              <div className="col-span-2 text-blue-100/60 text-sm italic">
                Standard automotive KPIs recommended for tracking performance.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MarketIntelligence
