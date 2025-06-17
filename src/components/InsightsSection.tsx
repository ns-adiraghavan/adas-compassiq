
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OverviewInsights from "@/components/OverviewInsights"
import CategoryAnalysis from "@/components/CategoryAnalysis"
import FeatureAnalysis from "@/components/FeatureAnalysis"
import SegmentAnalysis from "@/components/SegmentAnalysis"
import BusinessModelAnalysis from "@/components/BusinessModelAnalysis"

interface InsightsSectionProps {
  selectedInsight: string
  onInsightChange: (insight: string) => void
  selectedOEM: string
  selectedCountry: string
}

const InsightsSection = ({ 
  selectedInsight, 
  onInsightChange, 
  selectedOEM, 
  selectedCountry 
}: InsightsSectionProps) => {
  return (
    <div className="space-y-6">
      <Tabs value={selectedInsight} onValueChange={onInsightChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="Overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="Category" className="data-[state=active]:bg-blue-600">
            Category Analysis
          </TabsTrigger>
          <TabsTrigger value="Feature" className="data-[state=active]:bg-blue-600">
            Feature Analysis
          </TabsTrigger>
          <TabsTrigger value="Segment" className="data-[state=active]:bg-blue-600">
            Segment Analysis
          </TabsTrigger>
          <TabsTrigger value="Business" className="data-[state=active]:bg-blue-600">
            Business Model
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="Overview" className="mt-6">
          <OverviewInsights selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Category" className="mt-6">
          <CategoryAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Feature" className="mt-6">
          <FeatureAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Segment" className="mt-6">
          <SegmentAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Business" className="mt-6">
          <BusinessModelAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InsightsSection
