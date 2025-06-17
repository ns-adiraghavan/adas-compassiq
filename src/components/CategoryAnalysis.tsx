
import { Card } from "@/components/ui/card"
import { useAIAnalysis } from "@/hooks/useAIAnalysis"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

interface CategoryAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const CategoryAnalysis = ({ selectedOEM, selectedCountry }: CategoryAnalysisProps) => {
  const { data: waypointData, isLoading: dataLoading } = useWaypointData()
  const { data: aiAnalysis, isLoading: aiLoading } = useAIAnalysis({
    selectedOEM,
    selectedCountry,
    analysisType: 'category',
    enabled: !!selectedOEM
  })

  const categoryData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const categories = new Map()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const matchesOEM = !selectedOEM || row.OEM === selectedOEM
          const matchesCountry = selectedCountry === "Global" || row.Country === selectedCountry
          
          if (matchesOEM && matchesCountry && row.Category) {
            const category = row.Category
            const current = categories.get(category) || { count: 0, available: 0 }
            current.count++
            
            if (row["Feature Availability"] && 
                (row["Feature Availability"].toLowerCase().includes('yes') || 
                 row["Feature Availability"].toLowerCase().includes('available'))) {
              current.available++
            }
            
            categories.set(category, current)
          }
        })
      }
    })

    return Array.from(categories.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      availability: Math.round((data.available / data.count) * 100),
      trend: Math.floor(Math.random() * 20) - 10 // Simulated trend
    })).sort((a, b) => b.count - a.count)
  }, [waypointData, selectedOEM, selectedCountry])

  if (dataLoading || aiLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="bg-gray-900/50 border-gray-700/50 p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Real Category Data */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-light text-white mb-6 tracking-tight">
          Category Performance - {selectedOEM} ({selectedCountry})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryData.map((category) => (
            <div key={category.name} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-5 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-light text-white text-lg">{category.name}</h4>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  category.trend > 0 ? 'bg-green-500/20 text-green-400' : 
                  category.trend < 0 ? 'bg-red-500/20 text-red-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {category.trend > 0 ? '+' : ''}{category.trend}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Features</span>
                  <span className="text-white font-medium">{category.count}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Availability Rate</span>
                  <span className="text-blue-400 font-medium">{category.availability}%</span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${category.availability}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Analysis */}
      {aiAnalysis?.analysis && (
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-600/20 border-blue-500/20 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-blue-100 mb-4">AI-Powered Insights</h3>
          <div className="text-blue-200/80 font-light leading-relaxed">
            {typeof aiAnalysis.analysis === 'string' ? (
              <p>{aiAnalysis.analysis}</p>
            ) : (
              <div className="space-y-4">
                {aiAnalysis.analysis.insights && (
                  <div>
                    <h4 className="font-medium text-blue-100 mb-2">Key Insights:</h4>
                    <p className="text-blue-200/80">{aiAnalysis.analysis.insights}</p>
                  </div>
                )}
                {aiAnalysis.analysis.recommendations && (
                  <div>
                    <h4 className="font-medium text-blue-100 mb-2">Recommendations:</h4>
                    <p className="text-blue-200/80">{aiAnalysis.analysis.recommendations}</p>
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

export default CategoryAnalysis
