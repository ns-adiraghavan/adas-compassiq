
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import { useMemo } from "react"
import { Star, DollarSign, Users, Globe } from "lucide-react"

interface EnhancedFeatureAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const EnhancedFeatureAnalysis = ({ selectedOEM, selectedCountry }: EnhancedFeatureAnalysisProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const featureAnalysis = useMemo(() => {
    if (!waypointData?.csvData?.length) return { 
      topFeatures: [], 
      lighthouseFeatures: [], 
      businessModelBreakdown: [],
      featureAvailability: [],
      subscriptionFeatures: []
    }

    const featureData: Record<string, {
      count: number
      countries: Set<string>
      oems: Set<string>
      isLighthouse: boolean
      businessModel: string
      category: string
      segment: string
    }> = {}

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          
          if (selectedOEM && rowOEM !== selectedOEM) return
          if (selectedCountry && selectedCountry !== "Global" && rowCountry !== selectedCountry) return

          if (row.Feature) {
            if (!featureData[row.Feature]) {
              featureData[row.Feature] = {
                count: 0,
                countries: new Set(),
                oems: new Set(),
                isLighthouse: row['Lighthouse Feature'] === 'Yes',
                businessModel: row['Business Model'] || 'Unknown',
                category: row.Category || 'Unknown',
                segment: row.Segment || 'Unknown'
              }
            }
            
            featureData[row.Feature].count++
            if (rowCountry) featureData[row.Feature].countries.add(rowCountry)
            if (rowOEM) featureData[row.Feature].oems.add(rowOEM)
          }
        })
      }
    })

    const topFeatures = Object.entries(featureData)
      .map(([name, data]) => ({
        name,
        count: data.count,
        countries: data.countries.size,
        oems: data.oems.size,
        isLighthouse: data.isLighthouse,
        businessModel: data.businessModel,
        category: data.category,
        segment: data.segment
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    const lighthouseFeatures = topFeatures
      .filter(f => f.isLighthouse)
      .slice(0, 10)

    const subscriptionFeatures = topFeatures
      .filter(f => f.businessModel === 'Subscription')
      .slice(0, 10)

    const businessModelBreakdown = topFeatures.reduce((acc, feature) => {
      const model = feature.businessModel
      const existing = acc.find(item => item.model === model)
      if (existing) {
        existing.count += feature.count
        existing.features++
      } else {
        acc.push({ model, count: feature.count, features: 1 })
      }
      return acc
    }, [] as Array<{ model: string, count: number, features: number }>)

    const featureAvailability = topFeatures.slice(0, 15).map(feature => ({
      name: feature.name.length > 20 ? feature.name.substring(0, 20) + '...' : feature.name,
      fullName: feature.name,
      availability: feature.count,
      globalReach: feature.countries,
      oemAdoption: feature.oems
    }))

    return { topFeatures, lighthouseFeatures, businessModelBreakdown, featureAvailability, subscriptionFeatures }
  }, [waypointData, selectedOEM, selectedCountry])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60 font-light mt-4">Loading feature analysis...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Feature Availability Chart */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Top Features by Availability</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureAnalysis.featureAvailability} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                width={150}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                labelFormatter={(value) => featureAnalysis.featureAvailability.find(f => f.name === value)?.fullName || value}
              />
              <Bar dataKey="availability" fill="#3B82F6" name="Availability Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Lighthouse Features Spotlight */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-600/20 border-yellow-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Star className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-light text-white">Lighthouse Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureAnalysis.lighthouseFeatures.slice(0, 8).map((feature, index) => (
            <div key={feature.name} className="bg-white/5 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium text-sm leading-tight">{feature.name}</h4>
                <span className="text-yellow-400 text-xs font-semibold">#{index + 1}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Availability:</span>
                  <span className="text-white">{feature.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Countries:</span>
                  <span className="text-white">{feature.countries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">OEMs:</span>
                  <span className="text-white">{feature.oems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Category:</span>
                  <span className="text-white">{feature.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Subscription Features */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/20 border-green-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <DollarSign className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-light text-white">Top Subscription Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureAnalysis.subscriptionFeatures.slice(0, 9).map((feature, index) => (
            <div key={feature.name} className="bg-white/5 rounded-lg p-4 border border-green-500/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium text-sm leading-tight">{feature.name}</h4>
                <span className="text-green-400 text-xs font-semibold">#{index + 1}</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Adoption:</span>
                  <span className="text-white">{feature.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Segment:</span>
                  <span className="text-white">{feature.segment}</span>
                </div>
                {feature.isLighthouse && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">Lighthouse</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feature Global Reach Analysis */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-light text-white">Feature Global Reach vs Adoption</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={featureAnalysis.topFeatures.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="countries" 
                type="number" 
                domain={[0, 'dataMax + 1']}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                label={{ value: 'Global Reach (Countries)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' } }}
              />
              <YAxis 
                dataKey="count" 
                type="number"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                label={{ value: 'Adoption Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value, name, props) => [
                  value,
                  name === 'count' ? 'Adoption Count' : 'Countries',
                  props.payload.name
                ]}
              />
              <Scatter dataKey="count" fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Business Model Summary */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Feature Business Model Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureAnalysis.businessModelBreakdown.map((model) => (
            <div key={model.model} className="text-center">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  {model.model === 'Subscription' && <DollarSign className="h-5 w-5 text-green-400" />}
                  {model.model === 'Free' && <Users className="h-5 w-5 text-blue-400" />}
                  <h4 className="text-white font-medium">{model.model}</h4>
                </div>
                <p className="text-3xl font-bold text-white mb-2">{model.features}</p>
                <p className="text-white/60 text-sm mb-3">Features</p>
                <p className="text-lg font-semibold text-white/80">{model.count}</p>
                <p className="text-white/50 text-xs">Total Instances</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default EnhancedFeatureAnalysis
