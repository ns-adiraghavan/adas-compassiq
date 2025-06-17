
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapPin, Globe, TrendingUp, Flag } from "lucide-react"
import { useMemo } from "react"

interface GeographicStrategyProps {
  selectedOEM: string
}

const GeographicStrategy = ({ selectedOEM }: GeographicStrategyProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const geographicAnalysis = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM) return null

    const countryData: Record<string, {
      totalFeatures: number
      lighthouseFeatures: number
      subscriptionFeatures: number
      categories: Set<string>
      segments: Set<string>
    }> = {}

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          
          if (rowOEM === selectedOEM && rowCountry && rowCountry !== 'n/a') {
            if (!countryData[rowCountry]) {
              countryData[rowCountry] = {
                totalFeatures: 0,
                lighthouseFeatures: 0,
                subscriptionFeatures: 0,
                categories: new Set(),
                segments: new Set()
              }
            }
            
            countryData[rowCountry].totalFeatures++
            
            if (row['Lighthouse Feature']?.toLowerCase() === 'yes') {
              countryData[rowCountry].lighthouseFeatures++
            }
            
            if (row['Business Model']?.toLowerCase() === 'subscription') {
              countryData[rowCountry].subscriptionFeatures++
            }
            
            if (row.Category) countryData[rowCountry].categories.add(row.Category.trim())
            if (row.Segment) countryData[rowCountry].segments.add(row.Segment.trim())
          }
        })
      }
    })

    const countryMetrics = Object.entries(countryData)
      .map(([country, data]) => ({
        country,
        totalFeatures: data.totalFeatures,
        lighthouseFeatures: data.lighthouseFeatures,
        subscriptionFeatures: data.subscriptionFeatures,
        categories: data.categories.size,
        segments: data.segments.size,
        lighthouseRate: Math.round((data.lighthouseFeatures / data.totalFeatures) * 100),
        subscriptionRate: Math.round((data.subscriptionFeatures / data.totalFeatures) * 100)
      }))
      .sort((a, b) => b.totalFeatures - a.totalFeatures)

    const primaryMarket = countryMetrics[0]?.country || 'Unknown'
    const totalCountries = countryMetrics.length
    const totalFeatures = countryMetrics.reduce((sum, c) => sum + c.totalFeatures, 0)
    const avgFeaturesPerCountry = Math.round(totalFeatures / totalCountries)

    // Identify market tiers
    const tierData = countryMetrics.map(country => ({
      ...country,
      tier: country.totalFeatures >= avgFeaturesPerCountry * 1.5 ? 'Primary' :
            country.totalFeatures >= avgFeaturesPerCountry * 0.7 ? 'Secondary' : 'Emerging'
    }))

    return {
      countryMetrics: tierData,
      primaryMarket,
      totalCountries,
      totalFeatures,
      avgFeaturesPerCountry,
      tierDistribution: {
        Primary: tierData.filter(c => c.tier === 'Primary').length,
        Secondary: tierData.filter(c => c.tier === 'Secondary').length,
        Emerging: tierData.filter(c => c.tier === 'Emerging').length
      }
    }
  }, [waypointData, selectedOEM])

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </Card>
    )
  }

  if (!geographicAnalysis) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <p className="text-white/60">No geographic strategy data available for {selectedOEM}</p>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-light text-white">{selectedOEM} Geographic Strategy Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Flag className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{geographicAnalysis.primaryMarket}</p>
          <p className="text-white/60 text-sm">Primary Market</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{geographicAnalysis.totalCountries}</p>
          <p className="text-white/60 text-sm">Active Countries</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{geographicAnalysis.avgFeaturesPerCountry}</p>
          <p className="text-white/60 text-sm">Avg Features/Country</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Globe className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{geographicAnalysis.tierDistribution.Primary}</p>
          <p className="text-white/60 text-sm">Primary Markets</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-4">Country-wise Feature Deployment</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geographicAnalysis.countryMetrics} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="country" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="totalFeatures" fill="#3B82F6" name="Total Features" />
              <Bar dataKey="lighthouseFeatures" fill="#F59E0B" name="Lighthouse Features" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Market Tier Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(geographicAnalysis.tierDistribution).map(([tier, count]) => (
            <div key={tier} className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-white/60 text-sm">{tier} Markets</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-2">
          {geographicAnalysis.countryMetrics.slice(0, 6).map((country) => (
            <div key={country.country} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  country.tier === 'Primary' ? 'bg-green-400' :
                  country.tier === 'Secondary' ? 'bg-yellow-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-white font-medium">{country.country}</span>
                <span className="text-white/60 text-sm">({country.tier})</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{country.totalFeatures} features</div>
                <div className="text-white/60 text-xs">{country.lighthouseRate}% lighthouse • {country.subscriptionRate}% subscription</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default GeographicStrategy
