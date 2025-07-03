
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"
import { useMemo } from "react"
import { DollarSign, Users, Star, TrendingUp } from "lucide-react"

interface BusinessModelAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

const BusinessModelAnalysis = ({ selectedOEM, selectedCountry }: BusinessModelAnalysisProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const businessAnalysis = useMemo(() => {
    if (!waypointData?.csvData?.length) return {
      overallDistribution: [],
      oemComparison: [],
      categoryBreakdown: [],
      segmentAnalysis: [],
      lighthouseDistribution: [],
      revenuePotential: []
    }

    const businessModelData: Record<string, number> = {}
    const oemData: Record<string, Record<string, number>> = {}
    const categoryData: Record<string, Record<string, number>> = {}
    const segmentData: Record<string, Record<string, number>> = {}
    const lighthouseData: Record<string, number> = {}
    
    let totalFeatures = 0
    let subscriptionFeatures = 0
    let freeFeatures = 0
    let lighthouseSubscription = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          
          if (selectedOEM && rowOEM !== selectedOEM) return
          if (selectedCountry && selectedCountry !== "Global" && rowCountry !== selectedCountry) return

          totalFeatures++
          const businessModel = row['Business Model'] || 'Unknown'
          const category = row.Category || 'Unknown'
          const segment = row.Segment || 'Unknown'
          const isLighthouse = row['Lighthouse Feature'] === 'Yes'

          // Overall distribution
          businessModelData[businessModel] = (businessModelData[businessModel] || 0) + 1

          // Track metrics
          if (businessModel === 'Subscription') {
            subscriptionFeatures++
            if (isLighthouse) lighthouseSubscription++
          } else if (businessModel === 'Free') {
            freeFeatures++
          }

          // OEM comparison
          if (rowOEM && !rowOEM.toLowerCase().includes('merged')) {
            if (!oemData[rowOEM]) oemData[rowOEM] = {}
            oemData[rowOEM][businessModel] = (oemData[rowOEM][businessModel] || 0) + 1
          }

          // Category breakdown
          if (!categoryData[category]) categoryData[category] = {}
          categoryData[category][businessModel] = (categoryData[category][businessModel] || 0) + 1

          // Segment analysis
          if (!segmentData[segment]) segmentData[segment] = {}
          segmentData[segment][businessModel] = (segmentData[segment][businessModel] || 0) + 1

          // Lighthouse distribution
          if (isLighthouse) {
            lighthouseData[businessModel] = (lighthouseData[businessModel] || 0) + 1
          }
        })
      }
    })

    const overallDistribution = Object.entries(businessModelData).map(([model, count]) => ({
      name: model,
      value: count,
      percentage: Math.round((count / totalFeatures) * 100)
    }))

    const oemComparison = Object.entries(oemData)
      .map(([oem, models]) => {
        const totalOemFeatures = Object.values(models).reduce((sum, count) => sum + count, 0)
        return {
          oem,
          subscription: models.Subscription || 0,
          free: models.Free || 0,
          unknown: models.Unknown || 0,
          total: totalOemFeatures,
          subscriptionRate: Math.round(((models.Subscription || 0) / totalOemFeatures) * 100)
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    const categoryBreakdown = Object.entries(categoryData)
      .map(([category, models]) => {
        const totalCategoryFeatures = Object.values(models).reduce((sum, count) => sum + count, 0)
        return {
          category,
          subscription: models.Subscription || 0,
          free: models.Free || 0,
          unknown: models.Unknown || 0,
          total: totalCategoryFeatures
        }
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)

    const segmentAnalysis = Object.entries(segmentData)
      .map(([segment, models]) => {
        const totalSegmentFeatures = Object.values(models).reduce((sum, count) => sum + count, 0)
        return {
          segment,
          subscription: models.Subscription || 0,
          free: models.Free || 0,
          subscriptionRate: Math.round(((models.Subscription || 0) / totalSegmentFeatures) * 100)
        }
      })
      .sort((a, b) => b.subscriptionRate - a.subscriptionRate)

    const lighthouseDistribution = Object.entries(lighthouseData).map(([model, count]) => ({
      name: model,
      value: count
    }))

    // Revenue potential calculation (simplified)
    const revenuePotential = [
      {
        category: 'High Revenue',
        features: lighthouseSubscription,
        description: 'Lighthouse subscription features'
      },
      {
        category: 'Medium Revenue', 
        features: subscriptionFeatures - lighthouseSubscription,
        description: 'Standard subscription features'
      },
      {
        category: 'Freemium',
        features: freeFeatures,
        description: 'Free features (potential upsell)'
      }
    ]

    return {
      overallDistribution,
      oemComparison,
      categoryBreakdown,
      segmentAnalysis,
      lighthouseDistribution,
      revenuePotential
    }
  }, [waypointData, selectedOEM, selectedCountry])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60 font-light mt-4">Loading business model analysis...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Business Model Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Overall Business Model Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessAnalysis.overallDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {businessAnalysis.overallDistribution.map((entry, index) => (
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

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Revenue Potential Analysis</h3>
          <div className="space-y-4">
            {businessAnalysis.revenuePotential.map((item, index) => (
              <div key={item.category} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.category === 'High Revenue' && <Star className="h-5 w-5 text-yellow-400" />}
                    {item.category === 'Medium Revenue' && <DollarSign className="h-5 w-5 text-green-400" />}
                    {item.category === 'Freemium' && <Users className="h-5 w-5 text-blue-400" />}
                    <h4 className="text-white font-medium">{item.category}</h4>
                  </div>
                  <span className="text-white text-xl font-bold">{item.features}</span>
                </div>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* OEM Business Model Comparison */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">OEM Business Model Strategy</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={businessAnalysis.oemComparison} maxBarSize={40} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="oem" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="subscription" stackId="a" fill="#10B981" name="Subscription" />
              <Bar dataKey="free" stackId="a" fill="#3B82F6" name="Free" />
              <Bar dataKey="unknown" stackId="a" fill="#6B7280" name="Unknown" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Business Model Breakdown */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Category Monetization Strategy</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={businessAnalysis.categoryBreakdown} maxBarSize={40} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="subscription" stackId="a" fill="#10B981" name="Subscription" />
              <Bar dataKey="free" stackId="a" fill="#3B82F6" name="Free" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Segment Analysis */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Market Segment Monetization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessAnalysis.segmentAnalysis.map((segment) => (
            <div key={segment.segment} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3">{segment.segment}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Subscription</span>
                  <span className="text-green-400 font-semibold">{segment.subscription}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Free</span>
                  <span className="text-blue-400 font-semibold">{segment.free}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Sub Rate</span>
                    <span className="text-white font-semibold">{segment.subscriptionRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Lighthouse Features Business Model */}
      {businessAnalysis.lighthouseDistribution.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/20 border-yellow-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Star className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-light text-white">Lighthouse Features Monetization</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessAnalysis.lighthouseDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {businessAnalysis.lighthouseDistribution.map((entry, index) => (
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
            <div className="space-y-3">
              {businessAnalysis.lighthouseDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">{item.value}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-200 text-sm">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  Lighthouse features represent premium offerings with highest revenue potential
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default BusinessModelAnalysis
