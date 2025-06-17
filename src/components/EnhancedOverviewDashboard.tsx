
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
        countryComparison={dashboardMetrics.countryComparison}
      />

      {/* Country Comparison Table */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Global Market Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-white/80">Country</th>
                <th className="text-right p-3 text-white/80">Total Features</th>
                <th className="text-right p-3 text-white/80">Lighthouse</th>
                <th className="text-right p-3 text-white/80">Subscription %</th>
                <th className="text-left p-3 text-white/80">Top Category</th>
              </tr>
            </thead>
            <tbody>
              {dashboardMetrics.countryComparison?.slice(0, 8).map((country) => (
                <tr key={country.country} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-white font-medium">{country.country}</td>
                  <td className="p-3 text-right text-white">{country.totalFeatures}</td>
                  <td className="p-3 text-right text-yellow-400">{country.lighthouseFeatures}</td>
                  <td className="p-3 text-right text-green-400">{country.subscriptionRate}%</td>
                  <td className="p-3 text-white/70">{country.topCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
