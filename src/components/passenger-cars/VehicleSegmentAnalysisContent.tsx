import { useState, useEffect, useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMSelector from "./OEMSelector"
import VehicleSegmentChart from "./charts/VehicleSegmentChart"
import AISnippetsSidebar from "./AISnippetsSidebar"
import { useTheme } from "@/contexts/ThemeContext"

const VehicleSegmentAnalysisContent = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  // Set default country when data is loaded
  useEffect(() => {
    if (waypointData?.csvData?.length && !selectedCountry) {
      const uniqueCountries = new Set<string>()
      
      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.Country && typeof row.Country === 'string' && 
                row.Country.trim() !== '' && 
                row.Country.toLowerCase() !== 'yes' && 
                row.Country.toLowerCase() !== 'no' &&
                row.Country.toLowerCase() !== 'n/a') {
              uniqueCountries.add(row.Country.trim())
            }
          })
        }
      })

      const sortedCountries = Array.from(uniqueCountries).sort()
      if (sortedCountries.length > 0) {
        setSelectedCountry(sortedCountries[0])
      }
    }
  }, [waypointData, selectedCountry])

  // Get available OEMs for the selected country
  const availableOEMs = (() => {
    if (!waypointData?.csvData?.length || !selectedCountry) return []

    const uniqueOEMs = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry &&
              row.OEM && typeof row.OEM === 'string' && 
              row.OEM.trim() !== '' && 
              !row.OEM.toLowerCase().includes('merged') &&
              !row.OEM.toLowerCase().includes('monitoring') &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available') {
            uniqueOEMs.add(row.OEM.trim())
          }
        })
      }
    })

    return Array.from(uniqueOEMs).sort()
  })()

  // Auto-select first few OEMs if none selected
  useEffect(() => {
    if (availableOEMs.length > 0 && selectedOEMs.length === 0) {
      setSelectedOEMs(availableOEMs.slice(0, Math.min(3, availableOEMs.length)))
    }
  }, [availableOEMs, selectedOEMs.length])

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedOEMs([])
  }

  const handleOEMToggle = (oem: string) => {
    setSelectedOEMs(prev => 
      prev.includes(oem) 
        ? prev.filter(o => o !== oem)
        : [...prev, oem]
    )
  }

  const selectAllOEMs = () => {
    setSelectedOEMs(availableOEMs)
  }

  const clearAllOEMs = () => {
    setSelectedOEMs([])
  }

  // Generate vehicle segment analysis context for AI insights
  const vehicleSegmentContext = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return null
    }

    const segmentData: Record<string, { categories: Record<string, number>, total: number, oemDistribution: Record<string, number> }> = {}
    let totalFeatures = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const segment = row['Vehicle Segment']?.toString().trim() || 'Unknown'
            const category = row.Category?.toString().trim() || 'Unknown'
            const oem = row.OEM?.toString().trim()
            
            if (!segmentData[segment]) {
              segmentData[segment] = { categories: {}, total: 0, oemDistribution: {} }
            }
            
            segmentData[segment].categories[category] = (segmentData[segment].categories[category] || 0) + 1
            segmentData[segment].oemDistribution[oem] = (segmentData[segment].oemDistribution[oem] || 0) + 1
            segmentData[segment].total++
            totalFeatures++
          }
        })
      }
    })

    // Calculate segment insights
    const segmentBreakdown = Object.entries(segmentData).map(([segment, data]) => {
      const topCategory = Object.entries(data.categories).sort(([,a], [,b]) => b - a)[0]
      const leadingOEM = Object.entries(data.oemDistribution).sort(([,a], [,b]) => b - a)[0]
      
      return {
        segment,
        total: data.total,
        topCategory: topCategory?.[0] || 'Unknown',
        topCategoryCount: topCategory?.[1] || 0,
        leadingOEM: leadingOEM?.[0] || 'Unknown',
        leadingOEMCount: leadingOEM?.[1] || 0,
        categoryDistribution: data.categories,
        oemDistribution: data.oemDistribution
      }
    }).sort((a, b) => b.total - a.total)

    return {
      totalFeatures,
      selectedOEMs,
      selectedCountry,
      segmentBreakdown,
      topSegments: segmentBreakdown.slice(0, 5),
      analysisType: 'vehicle-segment-analysis'
    }
  }, [waypointData, selectedCountry, selectedOEMs])

  return (
    <div className="w-full flex">
      {/* Main Content Area - 60% */}
      <div className="w-3/5 px-6 py-4 space-y-6">
        {/* Countries Section */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-[120px]`}>
          <CountryButtons
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        </div>

        {/* OEM Selector - No limits for Vehicle Segment Analysis */}
        <OEMSelector
          selectedCountry={selectedCountry}
          selectedOEMs={selectedOEMs}
          onOEMToggle={handleOEMToggle}
          onSelectAll={selectAllOEMs}
          onClearAll={clearAllOEMs}
        />

        {/* Vehicle Segment Chart */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
              Features by Vehicle Segment and Category
            </h3>
            <p className={`${theme.textMuted} text-sm`}>
              Distribution of available features across categories for each vehicle segment in {selectedCountry}. Click on a segment bar to view detailed features.
            </p>
          </div>

          <VehicleSegmentChart
            selectedCountry={selectedCountry}
            selectedOEMs={selectedOEMs}
          />
        </div>
      </div>

      {/* AI Snippets Sidebar - 40% */}
      <div className="w-2/5">
        <div className="h-[880px]">
          <AISnippetsSidebar 
            selectedOEM={selectedOEMs.length === 1 ? selectedOEMs[0] : ""}
            selectedCountry={selectedCountry}
            oemClickedFromChart={false}
            selectedOEMs={selectedOEMs}
            analysisType="vehicle-segment"
            businessModelAnalysisContext={vehicleSegmentContext}
          />
        </div>
      </div>
    </div>
  )
}

export default VehicleSegmentAnalysisContent
