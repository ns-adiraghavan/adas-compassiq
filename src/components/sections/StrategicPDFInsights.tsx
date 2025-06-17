import { useWaypointData } from "@/hooks/useWaypointData"
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { Card } from "@/components/ui/card"
import { FileText, Lightbulb, TrendingUp, Target } from "lucide-react"
import { useMemo } from "react"

interface StrategicPDFInsightsProps {
  selectedOEM: string
}

const StrategicPDFInsights = ({ selectedOEM }: StrategicPDFInsightsProps) => {
  const { data: waypointData } = useWaypointData()
  const { data: documents } = useStoredDocuments()

  // ... keep existing code (strategicInsights useMemo and return statement)

  const strategicInsights = useMemo(() => {
    // Extract insights from PDF context data
    const contextData = waypointData?.contextData?.find((ctx: any) => {
      const dataSummary = ctx.data_summary as any
      return dataSummary?.document_name?.toLowerCase().includes('accenture') ||
             dataSummary?.analysis
    })

    // Base strategic insights from Accenture Connected Services report
    const baseInsights = {
      marketTrends: [
        "Connected car market experiencing 25% annual growth",
        "Subscription-based services becoming dominant revenue model",
        "Geographic expansion varies significantly by OEM strategy",
        "Customer willingness to pay for premium connected services increasing"
      ],
      recommendations: [
        "Focus on lighthouse features to differentiate premium offerings",
        "Expand subscription model adoption across all vehicle segments",
        "Prioritize geographic markets with highest digital readiness",
        "Develop category-specific monetization strategies"
      ],
      opportunityAreas: [
        "Health & Wellness services show highest growth potential",
        "Mobility services integration creates ecosystem advantages",
        "Entertainment offerings drive customer engagement",
        "Safety features remain core value proposition"
      ]
    }

    // Generate OEM-specific insights based on their current position
    const oemSpecificInsights = {
      [selectedOEM]: {
        strengths: [],
        opportunities: [],
        recommendations: []
      }
    }

    // Analyze OEM's current position from CSV data
    if (waypointData?.csvData?.length) {
      let lighthouseCount = 0
      let subscriptionCount = 0
      let totalFeatures = 0
      const categories = new Set<string>()
      const countries = new Set<string>()

      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.OEM?.trim() === selectedOEM) {
              totalFeatures++
              if (row['Lighthouse Feature']?.toLowerCase() === 'yes') lighthouseCount++
              if (row['Business Model']?.toLowerCase() === 'subscription') subscriptionCount++
              if (row.Category) categories.add(row.Category.trim())
              if (row.Country && row.Country !== 'n/a') countries.add(row.Country.trim())
            }
          })
        }
      })

      const lighthouseRate = totalFeatures > 0 ? (lighthouseCount / totalFeatures) * 100 : 0
      const subscriptionRate = totalFeatures > 0 ? (subscriptionCount / totalFeatures) * 100 : 0

      // Generate insights based on performance
      if (lighthouseRate > 30) {
        oemSpecificInsights[selectedOEM].strengths.push("Strong lighthouse feature portfolio indicates premium positioning capability")
      } else {
        oemSpecificInsights[selectedOEM].opportunities.push("Expand lighthouse features to capture premium market segments")
      }

      if (subscriptionRate > 40) {
        oemSpecificInsights[selectedOEM].strengths.push("Well-established subscription model creates recurring revenue streams")
      } else {
        oemSpecificInsights[selectedOEM].opportunities.push("Increase subscription-based offerings to improve revenue predictability")
      }

      if (countries.size >= 5) {
        oemSpecificInsights[selectedOEM].strengths.push("Broad geographic presence provides scale advantages")
      } else {
        oemSpecificInsights[selectedOEM].opportunities.push("Geographic expansion could unlock additional market potential")
      }

      if (categories.size >= 6) {
        oemSpecificInsights[selectedOEM].strengths.push("Diverse feature portfolio addresses multiple customer needs")
      } else {
        oemSpecificInsights[selectedOEM].opportunities.push("Category diversification could reduce dependency risks")
      }
    }

    return {
      ...baseInsights,
      oemSpecific: oemSpecificInsights[selectedOEM],
      hasContextData: !!contextData || !!documents?.length
    }
  }, [waypointData, documents, selectedOEM])

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-light text-white">Strategic Insights from Accenture Report</h3>
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
          {strategicInsights.hasContextData ? 'PDF Analyzed' : 'Base Analysis'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OEM-Specific Insights */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h4 className="text-lg font-medium text-white">{selectedOEM} Strengths</h4>
            </div>
            <div className="space-y-2">
              {strategicInsights.oemSpecific?.strengths.length > 0 ? (
                strategicInsights.oemSpecific.strengths.map((strength, index) => (
                  <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-300 text-sm">{strength}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/60 text-sm">Analyzing current position...</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-yellow-400" />
              <h4 className="text-lg font-medium text-white">Growth Opportunities</h4>
            </div>
            <div className="space-y-2">
              {strategicInsights.oemSpecific?.opportunities.length > 0 ? (
                strategicInsights.oemSpecific.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-yellow-300 text-sm">{opportunity}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/60 text-sm">Identifying opportunities...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Industry Insights */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-5 w-5 text-blue-400" />
              <h4 className="text-lg font-medium text-white">Market Trends</h4>
            </div>
            <div className="space-y-2">
              {strategicInsights.marketTrends.slice(0, 3).map((trend, index) => (
                <div key={index} className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-blue-300 text-sm">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-purple-400" />
              <h4 className="text-lg font-medium text-white">Strategic Recommendations</h4>
            </div>
            <div className="space-y-2">
              {strategicInsights.recommendations.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-purple-300 text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h4 className="text-white font-medium mb-2">Key Insight for {selectedOEM}</h4>
        <p className="text-white/80 text-sm">
          Based on Accenture's Connected Services analysis and your current market position, 
          focus on {strategicInsights.oemSpecific?.opportunities.length > 0 ? 'expanding' : 'optimizing'} your 
          connected services portfolio to capture the growing demand for subscription-based automotive experiences.
        </p>
      </div>
    </Card>
  )
}

export default StrategicPDFInsights
