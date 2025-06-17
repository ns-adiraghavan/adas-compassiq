
import { Card } from "@/components/ui/card"
import { useAIAnalysis } from "@/hooks/useAIAnalysis"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

interface FeatureAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const FeatureAnalysis = ({ selectedOEM, selectedCountry }: FeatureAnalysisProps) => {
  const { data: waypointData, isLoading: dataLoading } = useWaypointData()
  const { data: aiAnalysis, isLoading: aiLoading } = useAIAnalysis({
    selectedOEM,
    selectedCountry,
    analysisType: 'feature',
    enabled: !!selectedOEM
  })

  const featureData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const features = new Map()
    const lighthouseFeatures = new Set()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const matchesOEM = !selectedOEM || row.OEM === selectedOEM
          const matchesCountry = selectedCountry === "Global" || row.Country === selectedCountry
          
          if (matchesOEM && matchesCountry) {
            if (row.Feature) {
              const current = features.get(row.Feature) || { total: 0, available: 0 }
              current.total++
              
              if (row["Feature Availability"] && 
                  (row["Feature Availability"].toLowerCase().includes('yes') || 
                   row["Feature Availability"].toLowerCase().includes('available'))) {
                current.available++
              }
              
              features.set(row.Feature, current)
            }
            
            if (row["Lighthouse Feature"]) {
              lighthouseFeatures.add(row["Lighthouse Feature"])
            }
          }
        })
      }
    })

    return Array.from(features.entries()).map(([name, data]) => ({
      name,
      adoption: Math.round((data.available / data.total) * 100),
      importance: lighthouseFeatures.has(name) ? 'Critical' : 
                 data.total > 5 ? 'High' : 'Medium',
      isLighthouse: lighthouseFeatures.has(name)
    })).sort((a, b) => b.adoption - a.adoption).slice(0, 8) // Top 8 features
  }, [waypointData, selectedOEM, selectedCountry])

  if (dataLoading || aiLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="bg-gray-900/50 border-gray-700/50 p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Real Feature Data */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-light text-white mb-6 tracking-tight">
          Feature Adoption Analysis - {selectedOEM} ({selectedCountry})
        </h3>
        
        <div className="space-y-4">
          {featureData.map((feature) => (
            <div key={feature.name} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-light text-white">{feature.name}</h4>
                  {feature.isLighthouse && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                      Lighthouse
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  feature.importance === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  feature.importance === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {feature.importance}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Adoption Rate</span>
                  <span className="text-blue-400 font-medium">{feature.adoption}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${feature.adoption}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Analysis */}
      {aiAnalysis?.analysis && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/20 border-purple-500/20 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-purple-100 mb-4">AI Technology Insights</h3>
          <div className="text-purple-200/80 font-light leading-relaxed">
            {typeof aiAnalysis.analysis === 'string' ? (
              <p>{aiAnalysis.analysis}</p>
            ) : (
              <div className="space-y-4">
                {aiAnalysis.analysis.insights && (
                  <div>
                    <h4 className="font-medium text-purple-100 mb-2">Technology Insights:</h4>
                    <p className="text-purple-200/80">{aiAnalysis.analysis.insights}</p>
                  </div>
                )}
                {aiAnalysis.analysis.adoption_trends && (
                  <div>
                    <h4 className="font-medium text-purple-100 mb-2">Adoption Trends:</h4>
                    <p className="text-purple-200/80">{aiAnalysis.analysis.adoption_trends}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default FeatureAnalysis
