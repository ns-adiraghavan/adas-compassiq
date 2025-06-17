
import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { FileText, TrendingUp } from "lucide-react"

interface PDFInsightsProps {
  waypointData: any
  selectedOEM: string
  selectedCountry: string
}

const PDFInsights = ({ waypointData, selectedOEM, selectedCountry }: PDFInsightsProps) => {
  const pdfInsights = useMemo(() => {
    const contextData = waypointData?.contextData?.find((ctx: any) => {
      const dataSummary = ctx.data_summary as any
      return dataSummary?.document_name?.toLowerCase().includes('accenture') ||
             dataSummary?.analysis
    })
    
    if (contextData?.data_summary) {
      const dataSummary = contextData.data_summary as any
      if (dataSummary?.analysis) {
        return dataSummary.analysis
      }
    }
    
    return {
      summary: "Connected automotive services market analysis",
      insights: [
        "Global connected car market is experiencing rapid growth",
        "Subscription-based services are becoming dominant revenue model",
        "Geographic expansion varies significantly by OEM strategy"
      ],
      recommended_metrics: ["Feature adoption rates", "Geographic coverage", "Revenue model distribution"]
    }
  }, [waypointData])

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-light text-white">Strategic Intelligence</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium text-white/90 mb-3">Market Insights</h4>
          <div className="space-y-2">
            {pdfInsights.insights?.slice(0, 3).map((insight: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-white/70 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium text-white/90 mb-3">Current Analysis Context</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Selected OEM:</span>
              <span className="text-white font-medium">{selectedOEM || 'All OEMs'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Geographic Scope:</span>
              <span className="text-white font-medium">{selectedCountry || 'Global'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Data Source:</span>
              <span className="text-white font-medium">CSV + PDF Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PDFInsights
