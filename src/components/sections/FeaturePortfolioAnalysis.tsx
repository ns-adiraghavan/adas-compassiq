
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Star, Package, TrendingUp } from "lucide-react"
import { useMemo } from "react"

interface FeaturePortfolioAnalysisProps {
  selectedOEM: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16']

const FeaturePortfolioAnalysis = ({ selectedOEM }: FeaturePortfolioAnalysisProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const portfolioAnalysis = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM) return null

    const categoryData: Record<string, { total: number, lighthouse: number, standard: number }> = {}
    let totalFeatures = 0
    let lighthouseFeatures = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          
          if (rowOEM === selectedOEM && row.Category) {
            const category = row.Category.trim()
            const isLighthouse = row['Lighthouse Feature']?.toLowerCase() === 'yes'
            
            if (!categoryData[category]) {
              categoryData[category] = { total: 0, lighthouse: 0, standard: 0 }
            }
            
            categoryData[category].total++
            totalFeatures++
            
            if (isLighthouse) {
              categoryData[category].lighthouse++
              lighthouseFeatures++
            } else {
              categoryData[category].standard++
            }
          }
        })
      }
    })

    const categoryBreakdown = Object.entries(categoryData)
      .map(([name, data]) => ({
        name,
        total: data.total,
        lighthouse: data.lighthouse,
        standard: data.standard,
        lighthouseRate: Math.round((data.lighthouse / data.total) * 100)
      }))
      .sort((a, b) => b.total - a.total)

    const pieData = categoryBreakdown.map(cat => ({
      name: cat.name,
      value: cat.total
    }))

    return {
      categoryBreakdown,
      pieData,
      totalFeatures,
      lighthouseFeatures,
      lighthouseRate: Math.round((lighthouseFeatures / totalFeatures) * 100)
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

  if (!portfolioAnalysis) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <p className="text-white/60">No feature portfolio data available for {selectedOEM}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Package className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-light text-white">{selectedOEM} Feature Portfolio Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <Package className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{portfolioAnalysis.totalFeatures}</p>
            <p className="text-white/60 text-sm">Total Features</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{portfolioAnalysis.lighthouseFeatures}</p>
            <p className="text-white/60 text-sm">Lighthouse Features</p>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{portfolioAnalysis.lighthouseRate}%</p>
            <p className="text-white/60 text-sm">Lighthouse Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Feature Distribution by Category</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioAnalysis.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioAnalysis.pieData.map((entry, index) => (
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
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Lighthouse vs Standard Features</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portfolioAnalysis.categoryBreakdown.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
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
                  <Bar dataKey="lighthouse" fill="#F59E0B" name="Lighthouse Features" />
                  <Bar dataKey="standard" fill="#3B82F6" name="Standard Features" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FeaturePortfolioAnalysis
