
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
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
          <TabsTrigger 
            value="Overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
          >
            Global Overview
          </TabsTrigger>
          <TabsTrigger 
            value="Category" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
          >
            Category Comparison
          </TabsTrigger>
          <TabsTrigger 
            value="Feature" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 data-[state=active]:text-white transition-all duration-300"
          >
            Feature Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="Segment" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-300"
          >
            Market Segments
          </TabsTrigger>
          <TabsTrigger 
            value="Business" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
          >
            Business Models
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="Overview" className="mt-8">
          <OverviewInsights selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Category" className="mt-8">
          <CategoryAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Feature" className="mt-8">
          <FeatureAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Segment" className="mt-8">
          <SegmentAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
        
        <TabsContent value="Business" className="mt-8">
          <BusinessModelAnalysis selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InsightsSection
