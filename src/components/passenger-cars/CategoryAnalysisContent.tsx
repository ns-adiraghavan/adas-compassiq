import { useState, useEffect, useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMSelector from "./OEMSelector"
import CategoryAnalysisTable from "./CategoryAnalysisTable"
import AISnippetsSidebar from "./AISnippetsSidebar"
import { useTheme } from "@/contexts/ThemeContext"

const CategoryAnalysisContent = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
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

  // Auto-select first OEM if none selected
  useEffect(() => {
    if (availableOEMs.length > 0 && selectedOEMs.length === 0) {
      setSelectedOEMs([availableOEMs[0]])
    }
  }, [availableOEMs, selectedOEMs.length])

  // Generate category analysis context for AI insights
  const categoryAnalysisContext = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return null
    }

    const categoryData: Record<string, { features: any[], oemCounts: Record<string, number>, businessModels: Record<string, number> }> = {}
    let totalFeatures = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const category = row.Category?.toString().trim() || 'Unknown'
            const oem = row.OEM?.toString().trim()
            const businessModel = row['Business Model Type']?.toString().trim() || 'Unknown'
            
            if (!categoryData[category]) {
              categoryData[category] = { features: [], oemCounts: {}, businessModels: {} }
            }
            
            categoryData[category].features.push(row)
            categoryData[category].oemCounts[oem] = (categoryData[category].oemCounts[oem] || 0) + 1
            categoryData[category].businessModels[businessModel] = (categoryData[category].businessModels[businessModel] || 0) + 1
            totalFeatures++
          }
        })
      }
    })

    // Calculate category insights
    const categoryBreakdown = Object.entries(categoryData).map(([category, data]) => {
      const totalInCategory = data.features.length
      const leadingOEM = Object.entries(data.oemCounts).sort(([,a], [,b]) => b - a)[0]
      const topBusinessModel = Object.entries(data.businessModels).sort(([,a], [,b]) => b - a)[0]
      
      return {
        category,
        total: totalInCategory,
        leader: leadingOEM?.[0] || 'Unknown',
        leaderCount: leadingOEM?.[1] || 0,
        topBusinessModel: topBusinessModel?.[0] || 'Unknown',
        businessModelCount: topBusinessModel?.[1] || 0,
        oemDistribution: data.oemCounts,
        businessModelDistribution: data.businessModels
      }
    }).sort((a, b) => b.total - a.total)

    // Calculate OEM totals across categories
    const oemTotals: Record<string, number> = {}
    selectedOEMs.forEach(oem => {
      oemTotals[oem] = Object.values(categoryData).reduce((sum, data) => sum + (data.oemCounts[oem] || 0), 0)
    })

    return {
      totalFeatures,
      selectedOEMs,
      selectedCountry,
      categoryBreakdown,
      oemTotals,
      expandedCategory,
      topCategories: categoryBreakdown.slice(0, 5),
      analysisType: 'category-analysis'
    }
  }, [waypointData, selectedCountry, selectedOEMs, expandedCategory])

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedOEMs([])
    setExpandedCategory(null)
  }

  const handleOEMToggle = (oem: string) => {
    setSelectedOEMs(prev => 
      prev.includes(oem) 
        ? prev.filter(o => o !== oem)
        : [...prev, oem]
    )
    setExpandedCategory(null)
  }

  const selectAllOEMs = () => {
    setSelectedOEMs(availableOEMs)
    setExpandedCategory(null)
  }

  const clearAllOEMs = () => {
    setSelectedOEMs([])
    setExpandedCategory(null)
  }

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

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

        {/* OEM Selector */}
        <OEMSelector
          selectedCountry={selectedCountry}
          selectedOEMs={selectedOEMs}
          onOEMToggle={handleOEMToggle}
          onSelectAll={selectAllOEMs}
          onClearAll={clearAllOEMs}
        />

        {/* Category Analysis Table */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
              Category Analysis - Feature Availability
            </h3>
            <p className={`${theme.textMuted} text-sm`}>
              Showing available feature counts by category for selected OEMs in {selectedCountry}. Click on a category to view detailed features.
            </p>
          </div>

          <CategoryAnalysisTable
            selectedCountry={selectedCountry}
            selectedOEMs={selectedOEMs}
            expandedCategory={expandedCategory}
            onCategoryClick={handleCategoryClick}
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
            businessModelAnalysisContext={categoryAnalysisContext}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryAnalysisContent
