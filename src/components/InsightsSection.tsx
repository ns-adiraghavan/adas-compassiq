
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import OEMMarketPresence from "./sections/OEMMarketPresence"
import FeaturePortfolioAnalysis from "./sections/FeaturePortfolioAnalysis"
import BusinessModelIntelligence from "./sections/BusinessModelIntelligence"
import CompetitivePositioning from "./sections/CompetitivePositioning"
import GeographicStrategy from "./sections/GeographicStrategy"
import StrategicPDFInsights from "./sections/StrategicPDFInsights"

interface InsightsSectionProps {
  selectedOEM: string
}

const sections = [
  { id: 'market-presence', title: 'Market Presence Overview', component: OEMMarketPresence },
  { id: 'feature-portfolio', title: 'Feature Portfolio Analysis', component: FeaturePortfolioAnalysis },
  { id: 'business-model', title: 'Business Model Intelligence', component: BusinessModelIntelligence },
  { id: 'competitive', title: 'Competitive Positioning', component: CompetitivePositioning },
  { id: 'geographic', title: 'Geographic Strategy', component: GeographicStrategy },
  { id: 'strategic-insights', title: 'Strategic PDF Insights', component: StrategicPDFInsights }
]

const InsightsSection = ({ selectedOEM }: InsightsSectionProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'market-presence': true // Start with first section expanded
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const expandAll = () => {
    const allExpanded = sections.reduce((acc, section) => {
      acc[section.id] = true
      return acc
    }, {} as Record<string, boolean>)
    setExpandedSections(allExpanded)
  }

  const collapseAll = () => {
    setExpandedSections({})
  }

  if (!selectedOEM) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-light text-white mb-4">
            Select an OEM to View Intelligence Dashboard
          </h2>
          <p className="text-white/60 font-light">
            Choose an OEM from the filter above to explore comprehensive analytics and strategic insights
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light text-white mb-1">
              {selectedOEM} Intelligence Dashboard
            </h2>
            <p className="text-white/60 text-sm">
              Comprehensive analysis based on CSV data and PDF strategic insights
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={expandAll}
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Expand All
            </Button>
            <Button 
              onClick={collapseAll}
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Collapse All
            </Button>
          </div>
        </div>
      </Card>

      {/* Dashboard Sections */}
      {sections.map((section) => {
        const Component = section.component
        const isExpanded = expandedSections[section.id]
        
        return (
          <div key={section.id} className="space-y-2">
            <Button
              onClick={() => toggleSection(section.id)}
              variant="ghost"
              className="w-full justify-between p-4 h-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
            >
              <span className="text-white font-medium text-left">{section.title}</span>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-white/60" />
              ) : (
                <ChevronDown className="h-5 w-5 text-white/60" />
              )}
            </Button>
            
            {isExpanded && (
              <div className="animate-fade-in">
                <Component selectedOEM={selectedOEM} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default InsightsSection
