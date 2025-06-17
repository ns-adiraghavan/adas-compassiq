
import { Card } from "@/components/ui/card"
import { useAIAnalysis } from "@/hooks/useAIAnalysis"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

interface BusinessModelAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const BusinessModelAnalysis = ({ selectedOEM, selectedCountry }: BusinessModelAnalysisProps) => {
  const { data: waypointData, isLoading: dataLoading } = useWaypointData()
  const { data: aiAnalysis, isLoading: aiLoading } = useAIAnalysis({
    selectedOEM,
    selectedCountry,
    analysisType: 'business',
    enabled: !!selectedOEM
  })

  const businessModelData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const models = new Map()
    let totalCount = 0
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const matchesOEM = !selectedOEM || row.OEM === selectedOEM
          const matchesCountry = selectedCountry === "Global" || row.Country === selectedCountry
          
          if (matchesOEM && matchesCountry && row["Business Model Type"]) {
            const model = row["Business Model Type"]
            models.set(model, (models.get(model) || 0) + 1)
            totalCount++
          }
        })
      }
    })

    return Array.from(models.entries()).map(([name, count]) => ({
      name,
      count,
      share: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      description: getBusinessModelDescription(name)
    })).sort((a, b) => b.count - a.count)
  }, [waypointData, selectedOEM, selectedCountry])

  const getBusinessModelDescription = (modelType: string) => {
    const descriptions = {
      'Traditional Sales': 'Direct vehicle sales through dealerships',
      'Subscription': 'Monthly subscription-based vehicle access',
      'Leasing': 'Long-term vehicle leasing arrangements',
      'Mobility as a Service': 'Integrated transportation solutions',
      'Digital Sales': 'Online direct-to-consumer sales model',
      'Hybrid': 'Combination of traditional and digital approaches'
    }
    return descriptions[modelType] || 'Custom business model approach'
  }

  if (dataLoading || aiLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="bg-gray-900/50 border-gray-700/50 p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Real Business Model Data */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-light text-white mb-6 tracking-tight">
          Business Model Distribution - {selectedOEM} ({selectedCountry})
        </h3>
        
        <div className="space-y-6">
          {businessModelData.map((model) => (
            <div key={model.name} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-5 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-light text-white text-lg">{model.name}</h4>
                <span className="text-3xl font-thin text-blue-400">{model.share}%</span>
              </div>
              
              <p className="text-white/60 text-sm mb-4 font-light">{model.description}</p>
              
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-white/60">Occurrences</span>
                <span className="text-white font-medium">{model.count}</span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700" 
                  style={{ width: `${model.share}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Analysis */}
      {aiAnalysis?.analysis && (
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/20 border-orange-500/20 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-orange-100 mb-4">AI Business Intelligence</h3>
          <div className="text-orange-200/80 font-light leading-relaxed">
            {typeof aiAnalysis.analysis === 'string' ? (
              <p>{aiAnalysis.analysis}</p>
            ) : (
              <div className="space-y-4">
                {aiAnalysis.analysis.insights && (
                  <div>
                    <h4 className="font-medium text-orange-100 mb-2">Business Model Insights:</h4>
                    <p className="text-orange-200/80">{aiAnalysis.analysis.insights}</p>
                  </div>
                )}
                {aiAnalysis.analysis.revenue_implications && (
                  <div>
                    <h4 className="font-medium text-orange-100 mb-2">Revenue Implications:</h4>
                    <p className="text-orange-200/80">{aiAnalysis.analysis.revenue_implications}</p>
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

export default BusinessModelAnalysis
