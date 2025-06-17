
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, Users, Target, TrendingUp } from "lucide-react"
import { useMemo } from "react"

interface CompetitivePositioningProps {
  selectedOEM: string
}

const CompetitivePositioning = ({ selectedOEM }: CompetitivePositioningProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const competitiveAnalysis = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM) return null

    const oemMetrics: Record<string, {
      totalFeatures: number
      lighthouseFeatures: number
      countries: Set<string>
      categories: Set<string>
      subscriptionFeatures: number
    }> = {}

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          const isLighthouse = row['Lighthouse Feature']?.toLowerCase() === 'yes'
          const isSubscription = row['Business Model']?.toLowerCase() === 'subscription'
          
          if (rowOEM && rowOEM !== 'n/a') {
            if (!oemMetrics[rowOEM]) {
              oemMetrics[rowOEM] = {
                totalFeatures: 0,
                lighthouseFeatures: 0,
                countries: new Set(),
                categories: new Set(),
                subscriptionFeatures: 0
              }
            }
            
            oemMetrics[rowOEM].totalFeatures++
            if (isLighthouse) oemMetrics[rowOEM].lighthouseFeatures++
            if (isSubscription) oemMetrics[rowOEM].subscriptionFeatures++
            if (rowCountry && rowCountry !== 'n/a') oemMetrics[rowOEM].countries.add(rowCountry)
            if (row.Category) oemMetrics[rowOEM].categories.add(row.Category.trim())
          }
        })
      }
    })

    const competitorComparison = Object.entries(oemMetrics)
      .map(([oem, metrics]) => ({
        oem,
        totalFeatures: metrics.totalFeatures,
        lighthouseFeatures: metrics.lighthouseFeatures,
        countries: metrics.countries.size,
        categories: metrics.categories.size,
        subscriptionFeatures: metrics.subscriptionFeatures,
        lighthouseRate: Math.round((metrics.lighthouseFeatures / metrics.totalFeatures) * 100),
        subscriptionRate: Math.round((metrics.subscriptionFeatures / metrics.totalFeatures) * 100),
        isSelected: oem === selectedOEM
      }))
      .sort((a, b) => b.totalFeatures - a.totalFeatures)

    const selectedOEMData = competitorComparison.find(c => c.isSelected)
    const selectedRank = competitorComparison.findIndex(c => c.isSelected) + 1

    // Calculate competitive advantages
    const advantages = []
    if (selectedOEMData) {
      const avgLighthouseRate = competitorComparison.reduce((sum, c) => sum + c.lighthouseRate, 0) / competitorComparison.length
      const avgSubscriptionRate = competitorComparison.reduce((sum, c) => sum + c.subscriptionRate, 0) / competitorComparison.length
      
      if (selectedOEMData.lighthouseRate > avgLighthouseRate) {
        advantages.push(`Above average lighthouse rate (+${(selectedOEMData.lighthouseRate - avgLighthouseRate).toFixed(1)}%)`)
      }
      if (selectedOEMData.subscriptionRate > avgSubscriptionRate) {
        advantages.push(`Strong subscription model (+${(selectedOEMData.subscriptionRate - avgSubscriptionRate).toFixed(1)}%)`)
      }
      if (selectedOEMData.countries >= 5) {
        advantages.push(`Broad global presence (${selectedOEMData.countries} countries)`)
      }
    }

    return {
      competitorComparison,
      selectedOEMData,
      selectedRank,
      advantages,
      totalCompetitors: competitorComparison.length
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

  if (!competitiveAnalysis) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <p className="text-white/60">No competitive positioning data available for {selectedOEM}</p>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <h3 className="text-xl font-light text-white">{selectedOEM} Competitive Positioning</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">#{competitiveAnalysis.selectedRank}</p>
          <p className="text-white/60 text-sm">Market Rank</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{competitiveAnalysis.totalCompetitors}</p>
          <p className="text-white/60 text-sm">Total Competitors</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{competitiveAnalysis.selectedOEMData?.lighthouseRate || 0}%</p>
          <p className="text-white/60 text-sm">Lighthouse Rate</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{competitiveAnalysis.selectedOEMData?.subscriptionRate || 0}%</p>
          <p className="text-white/60 text-sm">Subscription Rate</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-4">Head-to-Head Comparison</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitiveAnalysis.competitorComparison} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="oem" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar 
                dataKey="totalFeatures" 
                fill={(entry) => entry.isSelected ? "#10B981" : "#3B82F6"}
                name="Total Features" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-4">Competitive Advantages</h4>
        <div className="space-y-2">
          {competitiveAnalysis.advantages.length > 0 ? (
            competitiveAnalysis.advantages.map((advantage, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm">{advantage}</span>
              </div>
            ))
          ) : (
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <span className="text-yellow-300 text-sm">Areas for improvement identified in competitive analysis</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default CompetitivePositioning
