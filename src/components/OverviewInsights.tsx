
import { useWaypointData } from "@/hooks/useWaypointData"
import { useOverviewAnalysis } from "@/hooks/useOverviewAnalysis"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Globe, Zap, Star, TrendingUp, DollarSign, CheckCircle, XCircle } from "lucide-react"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()
  const { data: analysisData, isLoading: isAnalysisLoading, error: analysisError } = useOverviewAnalysis({ selectedOEM, selectedCountry })

  console.log('OverviewInsights render:', { selectedOEM, selectedCountry, isLoading, isAnalysisLoading, analysisData, analysisError })

  const filteredData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM) return []

    const allRows: any[] = []
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const matchesOEM = row.OEM === selectedOEM
          const matchesCountry = selectedCountry === "Global" || row.Country === selectedCountry
          
          if (matchesOEM && matchesCountry) {
            allRows.push(row)
          }
        })
      }
    })
    
    console.log('Filtered data in component:', allRows.length, 'records')
    return allRows
  }, [waypointData, selectedOEM, selectedCountry])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-800/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!selectedOEM) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="text-center">
          <h3 className="text-xl text-white/70 mb-2">No OEM Selected</h3>
          <p className="text-white/50">Please select an OEM to view overview insights</p>
        </div>
      </div>
    )
  }

  // Show content even if analysis is loading
  const displayData = analysisData || {
    companyOverview: `${selectedOEM} is a leading automotive manufacturer with a strong focus on connected vehicle technologies and digital innovation.`,
    connectedPlatform: {
      name: `${selectedOEM} Connect`,
      description: `Integrated connected services platform delivering comprehensive digital experiences`,
      features: ["Connected Services", "Digital Platform", "Smart Integration", "Mobile Apps", "Cloud Services", "Data Analytics"]
    },
    lighthouseFeatures: [
      { name: "Advanced Connectivity", description: "Seamless integration across all touchpoints", category: "Platform" },
      { name: "Digital Services", description: "Comprehensive digital service ecosystem", category: "Services" },
      { name: "Smart Analytics", description: "AI-powered insights and recommendations", category: "Technology" },
      { name: "Mobile Experience", description: "Native mobile applications and interfaces", category: "User Experience" }
    ],
    vehicleTypes: { entry: true, mid: true, premium: true, luxury: false },
    geographicalPresence: selectedCountry === "Global" ? ["North America", "Europe", "Asia Pacific"] : [selectedCountry],
    keyServices: {
      safety: ["Emergency Services", "Vehicle Security", "Driver Assistance"],
      maintenance: ["Predictive Maintenance", "Service Scheduling", "Remote Diagnostics"],
      otaUpdates: ["Software Updates", "Feature Deployment", "System Optimization"],
      telematics: ["Vehicle Tracking", "Usage Analytics", "Performance Monitoring"],
      remoteControl: ["Remote Start", "Climate Control", "Door Lock/Unlock"]
    },
    financialInsights: {
      revenue: "Revenue data not publicly available",
      marketShare: "Market position varies by region"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-light text-white mb-2">{selectedOEM} Overview</h2>
        <p className="text-white/60 font-light">
          Comprehensive analysis of connected services and market presence
          {selectedCountry !== "Global" && ` in ${selectedCountry}`}
        </p>
        {isAnalysisLoading && (
          <div className="flex items-center mt-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
            <span className="text-blue-400 text-sm">AI analysis in progress...</span>
          </div>
        )}
      </div>

      {/* Company Overview & Connected Platform */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Overview */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Building className="h-6 w-6 mr-3 text-blue-400" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/70 text-sm leading-relaxed">
              {displayData.companyOverview}
            </p>
            
            {/* Financial Performance */}
            {displayData.financialInsights && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white/80 mb-2">Financial Performance</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Revenue:</span>
                    <span className="text-white">{displayData.financialInsights.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Market Share:</span>
                    <span className="text-white">{displayData.financialInsights.marketShare}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Service Platform */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-purple-200 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Connected Service Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-100">
                  {displayData.connectedPlatform?.name}
                </h3>
                <p className="text-purple-200/80 text-sm mt-2">
                  {displayData.connectedPlatform?.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(displayData.connectedPlatform?.features || []).slice(0, 6).map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/30">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lighthouse Features */}
      {displayData.lighthouseFeatures?.length > 0 && (
        <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-yellow-200 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Lighthouse Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayData.lighthouseFeatures.map((feature, index) => (
                <div key={index} className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3">
                  <h4 className="text-yellow-200 font-medium text-sm mb-1">{feature.name}</h4>
                  <p className="text-yellow-300/70 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Type Coverage & Geographical Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Type */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Vehicle Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(displayData.vehicleTypes || {}).map(([type, available]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white/80 capitalize">{type}</span>
                  {available ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographical Presence */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Geographical Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(displayData.geographicalPresence || []).slice(0, 8).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{country}</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Connected Services */}
      <Card className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border-green-600/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-green-200">Key Connected Services Aligning to Brand Promise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(displayData.keyServices || {}).map(([category, services]) => (
              <div key={category} className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                <h4 className="text-green-200 font-medium text-sm mb-2 capitalize flex items-center">
                  {category === 'safety' && <span className="mr-2">🛡️</span>}
                  {category === 'maintenance' && <span className="mr-2">🔧</span>}
                  {category === 'otaUpdates' && <span className="mr-2">📡</span>}
                  {category === 'telematics' && <span className="mr-2">📊</span>}
                  {category === 'remoteControl' && <span className="mr-2">📱</span>}
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-1">
                  {(services as string[]).slice(0, 3).map((service, index) => (
                    <div key={index} className="text-green-300/70 text-xs">{service}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OverviewInsights
