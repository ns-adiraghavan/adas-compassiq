
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { KPICard } from "@/components/KPICard"
import { FeatureChart } from "@/components/FeatureChart"
import { ImageCarousel } from "@/components/ImageCarousel"
import { DataTable } from "@/components/DataTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Truck, Brain, Globe, TrendingUp, Database } from "lucide-react"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-bold">EOM Dashboard</h1>
                  <p className="text-muted-foreground">AI-Powered Automotive Intelligence Platform</p>
                </div>
              </div>
              <Button>
                <Brain className="w-4 h-4 mr-2" />
                Ask AI
              </Button>
            </div>

            {/* Hero Image Carousel */}
            <ImageCarousel />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Features"
                value="543"
                trend={12}
                subtitle="Across all OEMs"
                icon={<Database className="h-4 w-4 text-muted-foreground" />}
              />
              <KPICard
                title="OEM Partners"
                value="8"
                trend={0}
                subtitle="Active manufacturers"
                icon={<Car className="h-4 w-4 text-muted-foreground" />}
              />
              <KPICard
                title="Global Coverage"
                value="15"
                trend={7}
                subtitle="Countries monitored"
                icon={<Globe className="h-4 w-4 text-muted-foreground" />}
              />
              <KPICard
                title="Availability Rate"
                value="87%"
                trend={3}
                subtitle="Feature deployment"
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FeatureChart />
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Latest intelligent analysis from your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Premium Features Trend</h4>
                    <p className="text-blue-800 text-sm">
                      Luxury OEMs are leading in autonomous driving features with 23% higher adoption than mass market brands.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Regional Analysis</h4>
                    <p className="text-green-800 text-sm">
                      European markets show highest feature availability at 92%, followed by North America at 85%.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Emerging Technologies</h4>
                    <p className="text-purple-800 text-sm">
                      Vehicle-to-infrastructure communication features are gaining traction with 34% YoY growth.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table */}
            <DataTable />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Database className="h-6 w-6" />
                    <span>Upload CSV Data</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Brain className="h-6 w-6" />
                    <span>Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>View Analytics</span>
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
