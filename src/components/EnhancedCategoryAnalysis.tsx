
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useMemo } from "react"

interface EnhancedCategoryAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16']

const EnhancedCategoryAnalysis = ({ selectedOEM, selectedCountry }: EnhancedCategoryAnalysisProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const categoryAnalysis = useMemo(() => {
    if (!waypointData?.csvData?.length) return { categories: [], businessModels: [], lighthouseByCategory: [] }

    const categoryData: Record<string, { total: number, subscription: number, free: number, lighthouse: number }> = {}

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          
          if (selectedOEM && rowOEM !== selectedOEM) return
          if (selectedCountry && selectedCountry !== "Global" && rowCountry !== selectedCountry) return

          if (row.Category) {
            if (!categoryData[row.Category]) {
              categoryData[row.Category] = { total: 0, subscription: 0, free: 0, lighthouse: 0 }
            }
            
            categoryData[row.Category].total++
            
            if (row['Business Model'] === 'Subscription') {
              categoryData[row.Category].subscription++
            } else if (row['Business Model'] === 'Free') {
              categoryData[row.Category].free++
            }
            
            if (row['Lighthouse Feature'] === 'Yes') {
              categoryData[row.Category].lighthouse++
            }
          }
        })
      }
    })

    const categories = Object.entries(categoryData)
      .map(([name, data]) => ({
        name,
        total: data.total,
        subscription: data.subscription,
        free: data.free,
        lighthouse: data.lighthouse,
        subscriptionRate: Math.round((data.subscription / data.total) * 100),
        lighthouseRate: Math.round((data.lighthouse / data.total) * 100)
      }))
      .sort((a, b) => b.total - a.total)

    const businessModels = categories.map(cat => ({
      name: cat.name,
      subscription: cat.subscription,
      free: cat.free
    }))

    const lighthouseByCategory = categories
      .filter(cat => cat.lighthouse > 0)
      .map(cat => ({
        name: cat.name,
        value: cat.lighthouse
      }))

    return { categories, businessModels, lighthouseByCategory }
  }, [waypointData, selectedOEM, selectedCountry])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60 font-light mt-4">Loading category analysis...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Overview */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Feature Categories Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryAnalysis.categories.slice(0, 8)} maxBarSize={45} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
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
              <Bar dataKey="total" fill="#3B82F6" name="Total Features" />
              <Bar dataKey="lighthouse" fill="#F59E0B" name="Lighthouse Features" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Business Model Distribution by Category */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Business Model Distribution by Category</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryAnalysis.businessModels.slice(0, 8)} maxBarSize={45} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
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
              <Bar dataKey="subscription" fill="#10B981" name="Subscription" />
              <Bar dataKey="free" fill="#8B5CF6" name="Free" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Lighthouse Features Distribution */}
      {categoryAnalysis.lighthouseByCategory.length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-light text-white mb-6">Lighthouse Features by Category</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryAnalysis.lighthouseByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryAnalysis.lighthouseByCategory.map((entry, index) => (
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
              {categoryAnalysis.lighthouseByCategory.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <span className="text-white/60">{item.value} features</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Category Performance Metrics */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Category Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryAnalysis.categories.slice(0, 6).map((category) => (
            <div key={category.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3">{category.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Total Features</span>
                  <span className="text-white font-semibold">{category.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Subscription Rate</span>
                  <span className="text-green-400 font-semibold">{category.subscriptionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Lighthouse Rate</span>
                  <span className="text-yellow-400 font-semibold">{category.lighthouseRate}%</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-white/50">
                    {category.subscription} subscription • {category.free} free • {category.lighthouse} lighthouse
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default EnhancedCategoryAnalysis
