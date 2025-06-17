
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import { Card } from "@/components/ui/card"
import MetricCards from "./dashboard/MetricCards"
import ChartVisualizations from "./dashboard/ChartVisualizations"
import BusinessModelBreakdown from "./dashboard/BusinessModelBreakdown"
import PDFInsights from "./dashboard/PDFInsights"

interface EnhancedOverviewDashboardProps {
  selectedOEM: string
  selectedCountry: string
}

const EnhancedOverviewDashboard = ({ selectedOEM, selectedCountry }: EnhancedOverviewDashboardProps) => {
  const { data: waypointData, isLoading: waypointLoading } = useWaypointData()
  const { data: documents, isLoading: documentsLoading } = useStoredDocuments()
  const { dashboardMetrics, isLoading: metricsLoading } = useDashboardMetrics(selectedOEM, selectedCountry)

  if (waypointLoading || documentsLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60 font-light mt-4">Loading intelligence dashboard...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <MetricCards metrics={dashboardMetrics} />

      {/* Data Visualizations Row */}
      <ChartVisualizations 
        topCategories={dashboardMetrics.topCategories}
        countryFeatures={dashboardMetrics.countryFeatures}
      />

      {/* Business Model Distribution */}
      <BusinessModelBreakdown 
        businessModelData={dashboardMetrics.businessModelData}
        totalFeatures={dashboardMetrics.totalFeatures}
      />

      {/* PDF Intelligence Integration */}
      <PDFInsights 
        waypointData={waypointData}
        selectedOEM={selectedOEM}
        selectedCountry={selectedCountry}
      />
    </div>
  )
}

export default EnhancedOverviewDashboard
