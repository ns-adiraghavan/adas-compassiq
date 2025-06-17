
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { FileText, Database, TrendingUp, Globe, Car, Building, Users, MapPin } from "lucide-react"
import { useMemo } from "react"

interface EnhancedOverviewDashboardProps {
  selectedOEM: string
  selectedCountry: string
}

const EnhancedOverviewDashboard = ({ selectedOEM, selectedCountry }: EnhancedOverviewDashboardProps) => {
  const { data: waypointData, isLoading: waypointLoading } = useWaypointData()
  const { data: documents, isLoading: documentsLoading } = useStoredDocuments()

  const dashboardMetrics = useMemo(() => {
    if (!waypointData?.csvData?.length) {
      return {
        totalFeatures: 0,
        totalOEMs: 0,
        totalCountries: 0,
        lighthouseFeatures: 0,
        subscriptionFeatures: 0,
        freeFeatures: 0,
        segments: {},
        categories: {},
        oemFeatureCount: {},
        countryFeatureCount: {}
      }
    }

    let totalFeatures = 0
    const uniqueOEMs = new Set<string>()
    const uniqueCountries = new Set<string>()
    let lighthouseFeatures = 0
    let subscriptionFeatures = 0
    let freeFeatures = 0
    const segments: Record<string, number> = {}
    const categories: Record<string, number> = {}
    const oemFeatureCount: Record<string, number> = {}
    const countryFeatureCount: Record<string, number> = {}

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          // Filter by selected OEM and Country if provided
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          
          if (selectedOEM && rowOEM !== selectedOEM) return
          if (selectedCountry && selectedCountry !== "Global" && rowCountry !== selectedCountry) return

          totalFeatures++

          // Track OEMs and Countries
          if (rowOEM && !rowOEM.toLowerCase().includes('merged') && !rowOEM.toLowerCase().includes('monitoring')) {
            uniqueOEMs.add(rowOEM)
            oemFeatureCount[rowOEM] = (oemFeatureCount[rowOEM] || 0) + 1
          }
          if (rowCountry && rowCountry.toLowerCase() !== 'yes' && rowCountry.toLowerCase() !== 'no') {
            uniqueCountries.add(rowCountry)
            countryFeatureCount[rowCountry] = (countryFeatureCount[rowCountry] || 0) + 1
          }

          // Track Lighthouse features
          if (row['Lighthouse Feature'] === 'Yes') {
            lighthouseFeatures++
          }

          // Track Business Models
          if (row['Business Model'] === 'Subscription') {
            subscriptionFeatures++
          } else if (row['Business Model'] === 'Free') {
            freeFeatures++
          }

          // Track Segments
          if (row.Segment) {
            segments[row.Segment] = (segments[row.Segment] || 0) + 1
          }

          // Track Categories
          if (row.Category) {
            categories[row.Category] = (categories[row.Category] || 0) + 1
          }
        })
      }
    })

    return {
      totalFeatures,
      totalOEMs: uniqueOEMs.size,
      totalCountries: uniqueCountries.size,
      lighthouseFeatures,
      subscriptionFeatures,
      freeFeatures,
      segments,
      categories,
      oemFeatureCount,
      countryFeatureCount
    }
  }, [waypointData, selectedOEM, selectedCountry])

  if (waypointLoading || documentsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded"></div>
              <div className="h-8 bg-white/20 rounded"></div>
              <div className="h-3 bg-white/20 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const pdfDocument = documents?.find(doc => doc.file_name.toLowerCase().includes('accenture') || doc.file_name.toLowerCase().includes('connected'))

  return (
    <div className="space-y-8">
      {/* Strategic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Car className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-light text-blue-100">Total Features</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-blue-50">{dashboardMetrics.totalFeatures.toLocaleString()}</p>
            <p className="text-blue-200/80 text-sm">Connected services tracked</p>
            <p className="text-blue-200/60 text-xs">
              {dashboardMetrics.lighthouseFeatures} lighthouse features
            </p>
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
              Avg {Math.round(dashboardMetrics.totalFeatures / (dashboardMetrics.totalCountries || 1))} features per country
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-orange-400" />
            <h3 className="text-lg font-light text-orange-100">Business Models</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-orange-50">
              {Math.round((dashboardMetrics.subscriptionFeatures / (dashboardMetrics.totalFeatures || 1)) * 100)}%
            </p>
            <p className="text-orange-200/80 text-sm">Subscription-based</p>
            <p className="text-orange-200/60 text-xs">
              {dashboardMetrics.freeFeatures} free features available
            </p>
          </div>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Feature Category Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(dashboardMetrics.categories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([category, count]) => (
              <div key={category} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium text-sm">{category}</h4>
                  <span className="text-white/60 text-xs">{count} features</span>
                </div>
                <div className="mt-2 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                    style={{ width: `${(count / dashboardMetrics.totalFeatures) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/50 text-xs mt-1">
                  {Math.round((count / dashboardMetrics.totalFeatures) * 100)}% of total
                </p>
              </div>
            ))}
        </div>
      </Card>

      {/* Current Selection Summary */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Current Analysis Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Selected OEM
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="font-semibold text-white">{selectedOEM || 'All OEMs'}</span>
              {selectedOEM && (
                <span className="block text-white/50 text-xs mt-1">
                  {dashboardMetrics.oemFeatureCount[selectedOEM] || 0} features analyzed
                </span>
              )}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-400" />
              Geographic Scope
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="font-semibold text-white">{selectedCountry || 'Global'}</span>
              {selectedCountry && selectedCountry !== "Global" && (
                <span className="block text-white/50 text-xs mt-1">
                  {dashboardMetrics.countryFeatureCount[selectedCountry] || 0} features in region
                </span>
              )}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-400" />
              Intelligence Source
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              {pdfDocument ? (
                <>
                  <span className="font-semibold text-white">Accenture Report</span>
                  <span className="block text-white/50 text-xs mt-1">
                    Strategic context integrated
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-white">Data Analysis</span>
                  <span className="block text-white/50 text-xs mt-1">
                    {waypointData?.csvData?.length || 0} data files processed
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Segment Analysis */}
      {Object.keys(dashboardMetrics.segments).length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Market Segment Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(dashboardMetrics.segments)
              .sort(([,a], [,b]) => b - a)
              .map(([segment, count]) => (
                <div key={segment} className="text-center">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">{segment}</h4>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-white/60 text-sm">
                      {Math.round((count / dashboardMetrics.totalFeatures) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default EnhancedOverviewDashboard
