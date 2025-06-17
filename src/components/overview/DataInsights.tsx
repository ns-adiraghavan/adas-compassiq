
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, Activity, Database } from "lucide-react"
import { useMemo } from "react"

interface DataInsightsProps {
  selectedOEM: string
  selectedCountry: string
  filteredData: any[]
}

const DataInsights = ({ selectedOEM, selectedCountry, filteredData }: DataInsightsProps) => {
  const analyticalInsights = useMemo(() => {
    if (!filteredData.length) {
      return {
        topCategories: [],
        businessModelDistribution: [],
        featureAvailabilityRate: 0,
        geographicCoverage: 0,
        keyFindings: []
      }
    }

    // Analyze top categories
    const categoryCount = new Map<string, number>()
    const businessModelCount = new Map<string, number>()
    const availabilityCount = { available: 0, total: 0 }
    const countries = new Set<string>()

    filteredData.forEach(row => {
      if (row.Category) {
        categoryCount.set(row.Category, (categoryCount.get(row.Category) || 0) + 1)
      }
      if (row["Business Model Type"]) {
        businessModelCount.set(row["Business Model Type"], (businessModelCount.get(row["Business Model Type"]) || 0) + 1)
      }
      if (row["Feature Availability"]) {
        availabilityCount.total++
        if (row["Feature Availability"].toLowerCase().includes('yes') || 
            row["Feature Availability"].toLowerCase().includes('available')) {
          availabilityCount.available++
        }
      }
      if (row.Country) {
        countries.add(row.Country)
      }
    })

    // Generate insights
    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count, percentage: Math.round((count / filteredData.length) * 100) }))

    const businessModels = Array.from(businessModelCount.entries())
      .map(([model, count]) => ({ model, count, percentage: Math.round((count / filteredData.length) * 100) }))

    const availabilityRate = availabilityCount.total > 0 
      ? Math.round((availabilityCount.available / availabilityCount.total) * 100)
      : 0

    // Generate key findings
    const keyFindings = []
    if (topCategories.length > 0) {
      keyFindings.push(`${topCategories[0].category} is the dominant feature category (${topCategories[0].percentage}%)`)
    }
    if (availabilityRate > 80) {
      keyFindings.push(`High feature availability rate of ${availabilityRate}%`)
    } else if (availabilityRate > 50) {
      keyFindings.push(`Moderate feature availability rate of ${availabilityRate}%`)
    }
    if (countries.size > 5) {
      keyFindings.push(`Strong global presence across ${countries.size} markets`)
    }
    if (businessModels.length > 2) {
      keyFindings.push(`Diversified business model strategy with ${businessModels.length} approaches`)
    }

    return {
      topCategories,
      businessModelDistribution: businessModels,
      featureAvailabilityRate: availabilityRate,
      geographicCoverage: countries.size,
      keyFindings
    }
  }, [filteredData])

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border-green-600/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-green-200 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Data-Driven Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Findings */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-green-300 mb-3">
            <Database className="h-4 w-4 mr-2" />
            Key Findings
          </h4>
          {analyticalInsights.keyFindings.length > 0 ? (
            <div className="space-y-2">
              {analyticalInsights.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <p className="text-green-100/80 text-sm leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-100/60 text-sm italic">
              Insufficient data for meaningful insights
            </p>
          )}
        </div>

        {/* Top Categories */}
        {analyticalInsights.topCategories.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-medium text-green-300 mb-3">
              <PieChart className="h-4 w-4 mr-2" />
              Top Feature Categories
            </h4>
            <div className="space-y-2">
              {analyticalInsights.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-green-200 text-sm">{category.category}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-green-900/30 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-green-300 text-xs font-medium w-8 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Model Distribution */}
        {analyticalInsights.businessModelDistribution.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-medium text-green-300 mb-3">
              <BarChart3 className="h-4 w-4 mr-2" />
              Business Model Mix
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {analyticalInsights.businessModelDistribution.map((model, index) => (
                <div 
                  key={index}
                  className="bg-green-600/10 border border-green-600/20 rounded p-2 flex justify-between items-center"
                >
                  <span className="text-green-200 text-sm">{model.model}</span>
                  <span className="text-green-300 text-xs font-medium">{model.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-600/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-200">{analyticalInsights.featureAvailabilityRate}%</div>
            <div className="text-xs text-green-300/70">Feature Availability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-200">{analyticalInsights.geographicCoverage}</div>
            <div className="text-xs text-green-300/70">Market Coverage</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataInsights
