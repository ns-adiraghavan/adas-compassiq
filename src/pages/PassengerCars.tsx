
import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, Globe, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import WaypointLogo from "@/components/WaypointLogo"
import OEMButtons from "@/components/OEMButtons"
import CountryButtons from "@/components/CountryButtons"
import InsightsSection from "@/components/InsightsSection"
import { KPICard } from "@/components/KPICard"
import { useFirstAvailableOEM, useDashboardMetrics } from "@/hooks/useWaypointData"

const PassengerCars = () => {
  const { data: firstOEM, isLoading: isLoadingFirstOEM } = useFirstAvailableOEM()
  const { data: dashboardMetrics, isLoading: metricsLoading } = useDashboardMetrics()
  const [selectedOEM, setSelectedOEM] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("Global")
  const [selectedInsight, setSelectedInsight] = useState("Overview")

  // Set the first available OEM as default when data is loaded
  useEffect(() => {
    if (firstOEM && !selectedOEM) {
      setSelectedOEM(firstOEM)
    }
  }, [firstOEM, selectedOEM])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Enhanced Header */}
      <header className="relative overflow-hidden border-b border-gray-700/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center space-x-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <WaypointLogo />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-tight">Passenger Cars Intelligence</h1>
            <p className="text-white/60 font-light mt-1">Real-time automotive market analytics powered by AI</p>
          </div>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* KPI Dashboard */}
      <div className="px-6 py-8 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-white/90 mb-6">Market Overview</h2>
          {metricsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700/50 p-6 h-32 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KPICard
                title="Total Features"
                value={dashboardMetrics?.totalFeatures?.toLocaleString() || "0"}
                trend={8}
                subtitle="Active automotive features"
                icon={<Zap className="h-5 w-5" />}
              />
              <KPICard
                title="OEM Partners"
                value={dashboardMetrics?.oemPartners || 0}
                trend={12}
                subtitle="Manufacturing partners"
                icon={<Users className="h-5 w-5" />}
              />
              <KPICard
                title="Global Coverage"
                value={`${dashboardMetrics?.globalCoverage || 0} Countries`}
                trend={5}
                subtitle="Market presence"
                icon={<Globe className="h-5 w-5" />}
              />
              <KPICard
                title="Data Quality"
                value={`${dashboardMetrics?.availabilityRate || 0}%`}
                trend={3}
                subtitle="Availability rate"
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>
          )}
        </div>
      </div>

      {/* OEM Selection */}
      <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          {isLoadingFirstOEM ? (
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 mr-4 flex items-center font-light">OEM Selection:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <OEMButtons selectedOEM={selectedOEM} onOEMChange={setSelectedOEM} />
          )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex min-h-[calc(100vh-280px)]">
        {/* Enhanced Country Sidebar */}
        <aside className="w-72 border-r border-gray-700/50 bg-gray-900/20 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-light text-white/90 mb-4">Regional Analysis</h3>
            <CountryButtons selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
          </div>
          
          {/* Quick Stats */}
          <div className="px-6 pb-6">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-4 backdrop-blur-sm">
              <h4 className="text-sm font-medium text-white/80 mb-3">Current Selection</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">OEM:</span>
                  <span className="text-white font-medium">{selectedOEM || "Loading..."}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Region:</span>
                  <span className="text-white font-medium">{selectedCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Analysis:</span>
                  <span className="text-white font-medium">{selectedInsight}</span>
                </div>
              </div>
            </Card>
          </div>
        </aside>

        {/* Enhanced Insights Content */}
        <main className="flex-1 bg-gradient-to-br from-gray-900/10 to-gray-800/20">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-white mb-2">
                Intelligence Dashboard
              </h2>
              <p className="text-white/60 font-light">
                Comprehensive analysis of {selectedOEM} across {selectedCountry === "Global" ? "global markets" : selectedCountry}
              </p>
            </div>
            
            <InsightsSection 
              selectedInsight={selectedInsight}
              onInsightChange={setSelectedInsight}
              selectedOEM={selectedOEM}
              selectedCountry={selectedCountry}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PassengerCars
