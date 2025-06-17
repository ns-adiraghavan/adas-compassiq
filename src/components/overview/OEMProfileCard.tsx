
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Globe, Zap } from "lucide-react"
import { useMemo } from "react"

interface OEMProfileCardProps {
  selectedOEM: string
  selectedCountry: string
  filteredData: any[]
  contextData: any[]
}

const OEMProfileCard = ({ selectedOEM, selectedCountry, filteredData, contextData }: OEMProfileCardProps) => {
  const oemInsights = useMemo(() => {
    console.log('OEMProfileCard - Processing insights for:', selectedOEM)
    console.log('OEMProfileCard - Filtered data length:', filteredData.length)
    console.log('OEMProfileCard - Context data length:', contextData.length)
    
    // Extract unique countries and segments for this OEM
    const countries = new Set<string>()
    const segments = new Set<string>()
    const businessModels = new Set<string>()
    const platforms = new Set<string>()
    
    filteredData.forEach(row => {
      if (row.Country) countries.add(row.Country)
      if (row["Entry Segment"]) segments.add("Entry")
      if (row["Mid Segment"]) segments.add("Mid")
      if (row["Premium Segment"]) segments.add("Premium")
      if (row["Luxury Segment"]) segments.add("Luxury")
      if (row["Business Model Type"]) businessModels.add(row["Business Model Type"])
      if (row.Platform) platforms.add(row.Platform)
    })

    // Get relevant context from document analysis
    const relevantContext = contextData.find(ctx => 
      ctx.data_summary?.analysis?.summary?.toLowerCase().includes(selectedOEM.toLowerCase()) ||
      ctx.data_summary?.analysis?.insights?.some((insight: string) => 
        insight.toLowerCase().includes(selectedOEM.toLowerCase())
      )
    )

    const insights = {
      countries: Array.from(countries),
      segments: Array.from(segments),
      businessModels: Array.from(businessModels),
      platforms: Array.from(platforms),
      contextInsights: relevantContext?.data_summary?.analysis
    }
    
    console.log('OEMProfileCard - Generated insights:', insights)
    return insights
  }, [filteredData, contextData, selectedOEM])

  const getOEMDescription = () => {
    // Try to get description from context first
    if (oemInsights.contextInsights?.summary) {
      return oemInsights.contextInsights.summary
    }

    // Enhanced fallback descriptions with more specific information
    const countryCount = oemInsights.countries.length
    const segmentCount = oemInsights.segments.length
    
    if (countryCount === 0 && segmentCount === 0) {
      // No data available - provide general automotive industry context
      return `${selectedOEM} is a prominent automotive manufacturer in the connected services ecosystem. As the automotive industry evolves towards software-defined vehicles, OEMs are focusing on developing comprehensive digital service platforms to enhance customer experience and create new revenue streams through connected car technologies.`
    }
    
    return `${selectedOEM} is a leading automotive manufacturer with connected services across ${countryCount} ${countryCount === 1 ? 'market' : 'markets'}, targeting ${segmentCount} vehicle ${segmentCount === 1 ? 'segment' : 'segments'}. The company focuses on delivering innovative connected car experiences through their integrated service platform.`
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Building className="h-6 w-6 mr-3 text-blue-400" />
          {selectedOEM} Company Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Description */}
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-2">About the Company</h4>
          <p className="text-white/70 text-sm leading-relaxed">
            {getOEMDescription()}
          </p>
        </div>

        {/* Key Facts Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 mr-2 text-green-400" />
              <span className="text-xs font-medium text-white/80">Global Presence</span>
            </div>
            <div className="text-white font-semibold">
              {oemInsights.countries.length > 0 ? `${oemInsights.countries.length} Markets` : 'Global Operations'}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {oemInsights.countries.length > 0 ? (
                <>
                  {oemInsights.countries.slice(0, 3).join(", ")}
                  {oemInsights.countries.length > 3 && " +more"}
                </>
              ) : (
                "Worldwide presence"
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="text-xs font-medium text-white/80">Market Segments</span>
            </div>
            <div className="text-white font-semibold">
              {oemInsights.segments.length > 0 ? `${oemInsights.segments.length} Segments` : 'Multi-Segment'}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {oemInsights.segments.length > 0 ? oemInsights.segments.join(", ") : "Entry to Luxury"}
            </div>
          </div>
        </div>

        {/* Business Models */}
        {oemInsights.businessModels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Business Models</h4>
            <div className="flex flex-wrap gap-2">
              {oemInsights.businessModels.map((model) => (
                <span 
                  key={model}
                  className="px-3 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Connected Platform */}
        {oemInsights.platforms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Connected Platforms</h4>
            <div className="flex flex-wrap gap-2">
              {oemInsights.platforms.map((platform) => (
                <span 
                  key={platform}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Industry Context when no specific data available */}
        {oemInsights.businessModels.length === 0 && oemInsights.platforms.length === 0 && (
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Industry Focus Areas</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-blue-600/10 border border-blue-600/20 rounded p-2">
                <span className="text-blue-300 font-medium">Connected Services</span>
              </div>
              <div className="bg-green-600/10 border border-green-600/20 rounded p-2">
                <span className="text-green-300 font-medium">Digital Platforms</span>
              </div>
              <div className="bg-purple-600/10 border border-purple-600/20 rounded p-2">
                <span className="text-purple-300 font-medium">Mobility Solutions</span>
              </div>
              <div className="bg-orange-600/10 border border-orange-600/20 rounded p-2">
                <span className="text-orange-300 font-medium">Software Integration</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OEMProfileCard
