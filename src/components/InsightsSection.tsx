
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageStorage from "./ImageStorage"
import PartnerEcosystem from "./PartnerEcosystem"

interface InsightsSectionProps {
  selectedOEM: string
}

const InsightsSection = ({ selectedOEM }: InsightsSectionProps) => {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-white/10 border-white/20">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="ecosystem" 
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 transition-all duration-200"
          >
            Partner Ecosystem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8 space-y-6">
          <ImageStorage />
          
          <div className="text-center py-16">
            <h2 className="text-2xl font-light text-white mb-4">
              Ready to Build Analytics
            </h2>
            <p className="text-white/60 font-light">
              Selected OEM: <span className="text-blue-400">{selectedOEM}</span>
            </p>
            <p className="text-white/40 font-light mt-2">
              Insights sections will be built here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ecosystem" className="mt-8">
          <PartnerEcosystem selectedOEM={selectedOEM} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InsightsSection
