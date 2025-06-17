
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { KPICard } from "@/components/KPICard"
import { FeatureChart } from "@/components/FeatureChart"
import { ImageCarousel } from "@/components/ImageCarousel"
import { DataTable } from "@/components/DataTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Truck, Brain, Globe, TrendingUp, Database, Sparkles } from "lucide-react"
import { useDashboardMetrics } from "@/hooks/useWaypointData"

const Index = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-primary/10 transition-colors duration-200" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    WayPoint Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1">AI-Powered Automotive Intelligence Platform</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 group">
                <Brain className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Ask AI
                <Sparkles className="w-4 h-4 ml-2 opacity-70" />
              </Button>
            </div>

            {/* Hero Image Carousel */}
            <div style={{ animationDelay: '200ms' }}>
              <ImageCarousel />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div style={{ animationDelay: '300ms' }}>
                <KPICard
                  title="Total Features"
                  value={metricsLoading ? "..." : metrics?.totalFeatures.toString() || "0"}
                  trend={metricsLoading ? undefined : 12}
                  subtitle="Across all OEMs"
                  icon={<Database className="h-5 w-5" />}
                />
              </div>
              <div style={{ animationDelay: '400ms' }}>
                <KPICard
                  title="OEM Partners"
                  value={metricsLoading ? "..." : metrics?.oemPartners.toString() || "0"}
                  trend={metricsLoading ? undefined : 0}
                  subtitle="Active manufacturers"
                  icon={<Car className="h-5 w-5" />}
                />
              </div>
              <div style={{ animationDelay: '500ms' }}>
                <KPICard
                  title="Global Coverage"
                  value={metricsLoading ? "..." : metrics?.globalCoverage.toString() || "0"}
                  trend={metricsLoading ? undefined : 7}
                  subtitle="Countries monitored"
                  icon={<Globe className="h-5 w-5" />}
                />
              </div>
              <div style={{ animationDelay: '600ms' }}>
                <KPICard
                  title="Data Files"
                  value={metricsLoading ? "..." : metrics?.dataFiles.toString() || "0"}
                  trend={metricsLoading ? undefined : 3}
                  subtitle="CSV datasets loaded"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div style={{ animationDelay: '700ms' }}>
                <FeatureChart />
              </div>
              
              <Card className="hover-lift animate-fade-in bg-gradient-to-br from-card/50 to-card border-primary/20" style={{ animationDelay: '800ms' }}>
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary animate-pulse-slow" />
                    AI Insights
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Latest intelligent analysis from your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 hover-glow transition-all duration-300 hover:bg-primary/15">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Data Quality Insights
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {metricsLoading 
                        ? "Analyzing data patterns..." 
                        : `Currently tracking ${metrics?.totalFeatures || 0} features across ${metrics?.oemPartners || 0} OEMs with ${metrics?.totalRows || 0} total data points.`
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 hover-glow transition-all duration-300 hover:bg-green-500/15">
                    <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Coverage Analysis
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {metricsLoading 
                        ? "Processing geographic data..." 
                        : `Global coverage spans ${metrics?.globalCoverage || 0} countries with comprehensive OEM feature mapping.`
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 hover-glow transition-all duration-300 hover:bg-purple-500/15">
                    <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Dataset Status
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {metricsLoading 
                        ? "Loading dataset information..." 
                        : `${metrics?.dataFiles || 0} active data files providing real-time automotive intelligence.`
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table */}
            <div style={{ animationDelay: '900ms' }}>
              <DataTable />
            </div>

            {/* Quick Actions */}
            <Card className="hover-lift animate-fade-in bg-gradient-to-br from-card/50 to-card border-primary/20" style={{ animationDelay: '1000ms' }}>
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-muted-foreground">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover-lift bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                    <Database className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-foreground">Upload CSV Data</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover-lift bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                    <Brain className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-foreground">Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-3 hover-lift bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                    <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-foreground">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Index
