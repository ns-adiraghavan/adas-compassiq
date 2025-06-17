
import { Card } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"
import { FileText, TrendingUp, BarChart3, PieChart } from "lucide-react"

interface DocumentDashboardProps {
  documentAnalysis?: any
}

const DocumentDashboard = ({ documentAnalysis }: DocumentDashboardProps) => {
  const { data: waypointData } = useWaypointData()

  const dashboardData = useMemo(() => {
    if (!documentAnalysis || !waypointData?.contextData?.length) {
      return null
    }

    // Get the latest document analysis from context data
    const latestAnalysis = waypointData.contextData
      .filter(item => item.metadata?.source === 'document_upload')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

    return latestAnalysis?.data_summary || documentAnalysis
  }, [documentAnalysis, waypointData])

  if (!dashboardData) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
        <FileText className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <h3 className="text-xl font-light text-white mb-2">No Document Analysis Available</h3>
        <p className="text-white/60 font-light">
          Upload a PDF or PowerPoint document to generate an intelligent dashboard based on the content.
        </p>
      </Card>
    )
  }

  const analysis = dashboardData.analysis || dashboardData

  return (
    <div className="space-y-8">
      {/* Document Summary */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/20 border-blue-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-light text-blue-100">Document Analysis Summary</h3>
        </div>
        <p className="text-blue-200/80 font-light leading-relaxed">
          {analysis.summary || "AI-powered analysis of uploaded document completed successfully."}
        </p>
        {dashboardData.document_name && (
          <p className="text-blue-300/60 text-sm mt-2">
            Source: {dashboardData.document_name}
          </p>
        )}
      </Card>

      {/* Key Insights */}
      {analysis.insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/20 border-green-500/20 p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h4 className="text-lg font-light text-green-100">Key Insights</h4>
            </div>
            <div className="space-y-3">
              {Array.isArray(analysis.insights) ? (
                analysis.insights.slice(0, 3).map((insight: string, index: number) => (
                  <p key={index} className="text-green-200/80 text-sm font-light">
                    • {insight}
                  </p>
                ))
              ) : (
                <p className="text-green-200/80 text-sm font-light">{analysis.insights}</p>
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/20 border-orange-500/20 p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-5 w-5 text-orange-400" />
              <h4 className="text-lg font-light text-orange-100">Recommended Metrics</h4>
            </div>
            <div className="space-y-3">
              {Array.isArray(analysis.recommended_metrics) ? (
                analysis.recommended_metrics.slice(0, 4).map((metric: string, index: number) => (
                  <p key={index} className="text-orange-200/80 text-sm font-light">
                    • {metric}
                  </p>
                ))
              ) : (
                <p className="text-orange-200/80 text-sm font-light">Performance tracking metrics identified</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Dashboard Sections */}
      {analysis.dashboard_sections && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/20 border-purple-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <PieChart className="h-5 w-5 text-purple-400" />
            <h4 className="text-lg font-light text-purple-100">Suggested Dashboard Sections</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.isArray(analysis.dashboard_sections) ? (
              analysis.dashboard_sections.map((section: string, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-purple-200/80 text-sm font-light">{section}</p>
                </div>
              ))
            ) : (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-purple-200/80 text-sm font-light">Custom dashboard sections</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Correlation Analysis */}
      {analysis.correlation_analysis && (
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/20 border-cyan-500/20 p-6 backdrop-blur-sm">
          <h4 className="text-lg font-light text-cyan-100 mb-4">Correlation with Passenger Car Data</h4>
          <p className="text-cyan-200/80 font-light leading-relaxed">
            {analysis.correlation_analysis}
          </p>
        </Card>
      )}
    </div>
  )
}

export default DocumentDashboard
