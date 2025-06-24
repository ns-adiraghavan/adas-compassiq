
import { useState, useEffect } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import OEMSelector from "./OEMSelector"
import BusinessModelChart from "./charts/BusinessModelChart"
import BusinessModelTable from "./BusinessModelTable"
import CategoryAnalysisTable from "./CategoryAnalysisTable"
import AISnippetsSidebar from "./AISnippetsSidebar"
import { useTheme } from "@/contexts/ThemeContext"

const BusinessModelAnalysisContent = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showGraphical, setShowGraphical] = useState(true)
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
      setSelectedOEMs(availableOEMs.slice(0, 3))
    }
  }, [availableOEMs, selectedOEMs.length])

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedOEMs([])
    setSelectedBusinessModel(null)
    setExpandedCategory(null)
  }

  const handleOEMToggle = (oem: string) => {
    setSelectedOEMs(prev => 
      prev.includes(oem) 
        ? prev.filter(o => o !== oem)
        : [...prev, oem]
    )
    setSelectedBusinessModel(null)
    setExpandedCategory(null)
  }

  const selectAllOEMs = () => {
    setSelectedOEMs(availableOEMs)
    setSelectedBusinessModel(null)
    setExpandedCategory(null)
  }

  const clearAllOEMs = () => {
    setSelectedOEMs([])
    setSelectedBusinessModel(null)
    setExpandedCategory(null)
  }

  const handleBusinessModelClick = (businessModel: string) => {
    setSelectedBusinessModel(businessModel)
    setExpandedCategory(null)
  }

  const handleCategoryClick = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  return (
    <div className="w-full flex">
      {/* Main Content Area - 60% */}
      <div className="w-3/5 px-6 py-4 space-y-6">
        {/* Page Title */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <h2 className={`text-2xl font-light ${theme.textPrimary} mb-2`}>Business Model Analysis</h2>
          <p className={`${theme.textMuted} text-sm`}>
            Analyze feature distribution across different business model types and OEMs
          </p>
        </div>

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

        {/* View Toggle */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGraphical(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showGraphical 
                  ? `${theme.primary} ${theme.textPrimary}` 
                  : `${theme.textSecondary} hover:${theme.cardBackground}`
              }`}
            >
              Graphical Representation
            </button>
            <button
              onClick={() => setShowGraphical(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !showGraphical 
                  ? `${theme.primary} ${theme.textPrimary}` 
                  : `${theme.textSecondary} hover:${theme.cardBackground}`
              }`}
            >
              Tabular Representation
            </button>
          </div>
        </div>

        {/* Business Model Visualization */}
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
              Features by Business Model Type & OEM
            </h3>
            <p className={`${theme.textMuted} text-sm`}>
              {showGraphical ? 'Click on bars to see category breakdown' : 'Business model type distribution matrix'}
            </p>
          </div>

          {showGraphical ? (
            <BusinessModelChart
              selectedCountry={selectedCountry}
              selectedOEMs={selectedOEMs}
              onBusinessModelClick={handleBusinessModelClick}
            />
          ) : (
            <BusinessModelTable
              selectedCountry={selectedCountry}
              selectedOEMs={selectedOEMs}
              onBusinessModelClick={handleBusinessModelClick}
            />
          )}
        </div>

        {/* Category Analysis - Shows when business model is selected */}
        {selectedBusinessModel && (
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
            <div className="mb-4">
              <h3 className={`text-lg font-medium ${theme.textPrimary} mb-2`}>
                Category Analysis - {selectedBusinessModel} Features
              </h3>
              <p className={`${theme.textMuted} text-sm`}>
                Feature breakdown by category for {selectedBusinessModel} business model type. Click on a category to view detailed features.
              </p>
            </div>

            <CategoryAnalysisTable
              selectedCountry={selectedCountry}
              selectedOEMs={selectedOEMs}
              businessModelFilter={selectedBusinessModel}
              expandedCategory={expandedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        )}
      </div>

      {/* AI Snippets Sidebar - 40% */}
      <div className="w-2/5">
        <div className="h-[880px]">
          <AISnippetsSidebar 
            selectedOEM={selectedOEMs.length === 1 ? selectedOEMs[0] : ""}
            selectedCountry={selectedCountry}
            oemClickedFromChart={false}
          />
        </div>
      </div>
    </div>
  )
}

export default BusinessModelAnalysisContent
