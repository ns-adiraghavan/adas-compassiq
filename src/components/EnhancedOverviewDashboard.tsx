
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { FileText, Database, TrendingUp, Globe, Car, Building, Users, MapPin, Star, DollarSign } from "lucide-react"
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface EnhancedOverviewDashboardProps {
  selectedOEM: string
  selectedCountry: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

const EnhancedOverviewDashboard = ({ selectedOEM, selectedCountry }: EnhancedOverviewDashboardProps) => {
  const { data: waypointData, isLoading: waypointLoading } = useWaypointData()
  const { data: documents, isLoading: documentsLoading } = useStoredDocuments()

  const dashboardMetrics = useMemo(() => {
    console.log('Processing waypoint data:', waypointData)
    
    if (!waypointData?.csvData || !Array.isArray(waypointData.csvData) || waypointData.csvData.length === 0) {
      return {
        totalFeatures: 0,
        totalOEMs: 0,
        totalCountries: 0,
        lighthouseFeatures: 0,
        subscriptionFeatures: 0,
        freeFeatures: 0,
        topCategories: [],
        businessModelData: [],
        countryFeatures: [],
        oemPerformance: []
      }
    }

    let totalFeatures = 0
    const uniqueOEMs = new Set<string>()
    const uniqueCountries = new Set<string>()
    let lighthouseFeatures = 0
    let subscriptionFeatures = 0
    let freeFeatures = 0
    const categoryCount: Record<string, number> = {}
    const countryFeatureCount: Record<string, number> = {}
    const oemFeatureCount: Record<string, number> = {}

    // Process CSV data
    waypointData.csvData.forEach(file => {
      console.log('Processing file:', file.file_name, 'with rows:', Array.isArray(file.data) ? file.data.length : 0)
      
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.toString().trim()
          const rowCountry = row.Country?.toString().trim()
          const rowFeature = row.Feature?.toString().trim()
          
          // Apply filters
          if (selectedOEM && rowOEM !== selectedOEM) return
          if (selectedCountry && selectedCountry !== "Global" && rowCountry !== selectedCountry) return

          // Only count if we have a valid feature
          if (rowFeature && rowFeature !== '' && rowFeature.toLowerCase() !== 'n/a') {
            totalFeatures++

            // Track OEMs
            if (rowOEM && rowOEM !== '' && !rowOEM.toLowerCase().includes('merged')) {
              uniqueOEMs.add(rowOEM)
              oemFeatureCount[rowOEM] = (oemFeatureCount[rowOEM] || 0) + 1
            }

            // Track Countries
            if (rowCountry && rowCountry !== '' && 
                !['yes', 'no', 'n/a', 'na'].includes(rowCountry.toLowerCase())) {
              uniqueCountries.add(rowCountry)
              countryFeatureCount[rowCountry] = (countryFeatureCount[rowCountry] || 0) + 1
            }

            // Track Categories
            if (row.Category && row.Category.toString().trim() !== '') {
              const category = row.Category.toString().trim()
              categoryCount[category] = (categoryCount[category] || 0) + 1
            }

            // Track Lighthouse features
            if (row['Lighthouse Feature']?.toString().toLowerCase() === 'yes') {
              lighthouseFeatures++
            }

            // Track Business Models
            const businessModel = row['Business Model']?.toString().trim()
            if (businessModel?.toLowerCase() === 'subscription') {
              subscriptionFeatures++
            } else if (businessModel?.toLowerCase() === 'free') {
              freeFeatures++
            }
          }
        })
      }
    })

    // Prepare visualization data
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, value: count }))

    const businessModelData = [
      { name: 'Subscription', value: subscriptionFeatures, color: '#10B981' },
      { name: 'Free', value: freeFeatures, color: '#3B82F6' },
      { name: 'Other', value: totalFeatures - subscriptionFeatures - freeFeatures, color: '#8B5CF6' }
    ].filter(item => item.value > 0)

    const countryFeatures = Object.entries(countryFeatureCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name: name.length > 12 ? name.substring(0, 12) + '...' : name, count }))

    const oemPerformance = Object.entries(oemFeatureCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ 
        name: name.length > 15 ? name.substring(0, 15) + '...' : name, 
        features: count,
        countries: Object.keys(countryFeatureCount).length
      }))

    console.log('Calculated metrics:', {
      totalFeatures,
      totalOEMs: uniqueOEMs.size,
      totalCountries: uniqueCountries.size,
      lighthouseFeatures,
      subscriptionFeatures,
      freeFeatures
    })

    return {
      totalFeatures,
      totalOEMs: uniqueOEMs.size,
      totalCountries: uniqueCountries.size,
      lighthouseFeatures,
      subscriptionFeatures,
      freeFeatures,
      topCategories,
      businessModelData,
      countryFeatures,
      oemPerformance
    }
  }, [waypointData, selectedOEM, selectedCountry])

  // Extract PDF insights
  const pdfInsights = useMemo(() => {
    const contextData = waypointData?.contextData?.find(ctx => {
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

  if (waypointLoading || documentsLoading) {
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-light text-blue-100">Total Features</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-blue-50">{dashboardMetrics.totalFeatures.toLocaleString()}</p>
            <p className="text-blue-200/80 text-sm">Connected services tracked</p>
            <div className="flex items-center space-x-2 mt-3">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-blue-200/60 text-xs">{dashboardMetrics.lighthouseFeatures} lighthouse features</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Building className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-light text-green-100">OEM Partners</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-50">{dashboardMetrics.totalOEMs}</p>
            <p className="text-green-200/80 text-sm">Global manufacturers</p>
            <p className="text-green-200/60 text-xs">
              Avg {Math.round(dashboardMetrics.totalFeatures / (dashboardMetrics.totalOEMs || 1))} features per OEM
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-light text-purple-100">Global Reach</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-purple-50">{dashboardMetrics.totalCountries}</p>
            <p className="text-purple-200/80 text-sm">Countries covered</p>
            <p className="text-purple-200/60 text-xs">
              {Math.round(dashboardMetrics.totalFeatures / (dashboardMetrics.totalCountries || 1))} avg features/country
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-6 w-6 text-orange-400" />
            <h3 className="text-lg font-light text-orange-100">Revenue Model</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-orange-50">
              {Math.round((dashboardMetrics.subscriptionFeatures / (dashboardMetrics.totalFeatures || 1)) * 100)}%
            </p>
            <p className="text-orange-200/80 text-sm">Subscription-based</p>
            <p className="text-orange-200/60 text-xs">
              {dashboardMetrics.freeFeatures} free features
            </p>
          </div>
        </Card>
      </div>

      {/* Data Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories Chart */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Top Feature Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardMetrics.topCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardMetrics.topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Country Distribution */}
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Features by Country</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardMetrics.countryFeatures}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Business Model Distribution */}
      {dashboardMetrics.businessModelData.length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Business Model Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardMetrics.businessModelData.map((model) => (
              <div key={model.name} className="text-center">
                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-6 border border-white/10">
                  <h4 className="text-white font-medium mb-2">{model.name}</h4>
                  <p className="text-3xl font-bold text-white mb-1" style={{ color: model.color }}>
                    {model.value}
                  </p>
                  <p className="text-white/60 text-sm">
                    {Math.round((model.value / dashboardMetrics.totalFeatures) * 100)}% of features
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* PDF Intelligence Integration */}
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
    </div>
  )
}

export default EnhancedOverviewDashboard
