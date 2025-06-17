
import { Car, Database, Globe, TrendingUp } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { FeatureChart } from "@/components/FeatureChart"
import { DataTable } from "@/components/DataTable"
import { useDashboardMetrics } from "@/hooks/useWaypointData"

const Dashboard = () => {
  const { data: metrics, isLoading } = useDashboardMetrics()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60">Loading WayPoint Intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Apple-inspired typography */}
        <div className="text-center space-y-4 py-12">
          <h1 className="text-5xl font-thin tracking-tight text-white">
            WayPoint Intelligence
          </h1>
          <p className="text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Real-time automotive data insights powered by advanced analytics
          </p>
        </div>

        {/* KPI Cards with Apple-inspired spacing and design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Features"
            value={metrics?.totalFeatures?.toLocaleString() || "0"}
            subtitle="Tracked automotive features"
            icon={<Car className="h-5 w-5" />}
            trend={5.2}
          />
          <KPICard
            title="OEM Partners"
            value={metrics?.oemPartners || "0"}
            subtitle="Global manufacturers"
            icon={<Database className="h-5 w-5" />}
            trend={12.1}
          />
          <KPICard
            title="Global Coverage"
            value={`${metrics?.globalCoverage || "0"}`}
            subtitle="Countries & regions"
            icon={<Globe className="h-5 w-5" />}
            trend={8.7}
          />
          <KPICard
            title="Data Availability"
            value={`${metrics?.availabilityRate || "0"}%`}
            subtitle="Real-time accuracy"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={2.3}
          />
        </div>

        {/* Charts and Data with generous spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeatureChart />
          <DataTable />
        </div>

        {/* Additional insights section */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
          <h2 className="text-2xl font-light text-white mb-4">
            Data Insights Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-thin text-white">{metrics?.dataFiles || "0"}</p>
              <p className="text-white/60 text-sm font-light">Data Files Processed</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-thin text-white">{metrics?.totalRows?.toLocaleString() || "0"}</p>
              <p className="text-white/60 text-sm font-light">Total Data Points</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-thin text-white">99.9%</p>
              <p className="text-white/60 text-sm font-light">System Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
