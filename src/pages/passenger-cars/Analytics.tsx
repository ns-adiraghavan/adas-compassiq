
import { useState, useEffect } from "react"
import { useFirstAvailableOEM, useWaypointData } from "@/hooks/useWaypointData"
import CountryButtons from "@/components/CountryButtons"
import PassengerCarsLayout from "@/components/passenger-cars/PassengerCarsLayout"
import { useTheme } from "@/contexts/ThemeContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

const CategoryAnalysisContent = () => {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedOEMs, setSelectedOEMs] = useState<string[]>([])
  const [showOEMSelector, setShowOEMSelector] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const { data: firstOEM } = useFirstAvailableOEM()
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

  // Generate table data
  const tableData = (() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return []
    }

    const categoryOEMCount: Record<string, Record<string, number>> = {}
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory && rowCategory !== '' &&
              featureAvailability === 'available') {
            
            if (!categoryOEMCount[rowCategory]) {
              categoryOEMCount[rowCategory] = {}
            }
            
            if (!categoryOEMCount[rowCategory][rowOEM]) {
              categoryOEMCount[rowCategory][rowOEM] = 0
            }
            
            categoryOEMCount[rowCategory][rowOEM]++
          }
        })
      }
    })

    // Convert to table rows
    return Object.entries(categoryOEMCount)
      .map(([category, oemCounts]) => ({
        category,
        ...oemCounts,
        total: Object.values(oemCounts).reduce((sum, count) => sum + count, 0)
      }))
      .sort((a, b) => b.total - a.total)
  })()

  // Generate features data for expanded category
  const getFeaturesForCategory = (category: string) => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return []
    }

    const features: Array<{
      feature: string
      oem: string
      businessModel?: string
      lighthouseFeature?: string
    }> = []
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const rowFeature = row.Feature?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory === category &&
              rowFeature && rowFeature !== '' &&
              featureAvailability === 'available') {
            
            features.push({
              feature: rowFeature,
              oem: rowOEM,
              businessModel: row['Business Model']?.toString().trim() || '',
              lighthouseFeature: row['Lighthouse Feature']?.toString().trim() || ''
            })
          }
        })
      }
    })

    return features.sort((a, b) => a.feature.localeCompare(b.feature))
  }

  return (
    <div className="w-full px-6 py-4 space-y-6">
      {/* Countries Section */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-[120px]`}>
        <CountryButtons
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
        />
      </div>

      {/* OEM Selector */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${theme.textPrimary}`}>Select OEMs</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllOEMs}
              className={`${theme.textSecondary} border-gray-600 hover:bg-gray-800`}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllOEMs}
              className={`${theme.textSecondary} border-gray-600 hover:bg-gray-800`}
            >
              Clear All
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-32 overflow-y-auto">
          {availableOEMs.map((oem) => (
            <div key={oem} className="flex items-center space-x-2">
              <Checkbox
                id={oem}
                checked={selectedOEMs.includes(oem)}
                onCheckedChange={() => handleOEMToggle(oem)}
              />
              <label
                htmlFor={oem}
                className={`text-sm ${theme.textSecondary} cursor-pointer truncate`}
                title={oem}
              >
                {oem}
              </label>
            </div>
          ))}
        </div>
        
        {selectedOEMs.length > 0 && (
          <div className={`mt-3 text-sm ${theme.textMuted}`}>
            Selected: {selectedOEMs.length} OEM{selectedOEMs.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

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

        {tableData.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={`${theme.cardBorder} border-b`}>
                    <TableHead className={`${theme.textSecondary} font-medium`}>Category</TableHead>
                    {selectedOEMs.map((oem) => (
                      <TableHead key={oem} className={`${theme.textSecondary} font-medium text-center`}>
                        {oem.length > 12 ? oem.substring(0, 12) + '...' : oem}
                      </TableHead>
                    ))}
                    <TableHead className={`${theme.textSecondary} font-medium text-center`}>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow 
                      key={row.category} 
                      className={`${theme.cardBorder} border-b hover:bg-gray-800/30 cursor-pointer transition-colors ${
                        expandedCategory === row.category ? 'bg-gray-800/20' : ''
                      }`}
                      onClick={() => handleCategoryClick(row.category)}
                    >
                      <TableCell className={`${theme.textPrimary} font-medium`}>
                        <div className="flex items-center gap-2">
                          {expandedCategory === row.category ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {row.category}
                        </div>
                      </TableCell>
                      {selectedOEMs.map((oem) => (
                        <TableCell key={oem} className={`${theme.textSecondary} text-center`}>
                          {row[oem] || 0}
                        </TableCell>
                      ))}
                      <TableCell className={`${theme.textPrimary} text-center font-medium`}>
                        {row.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Expanded Features Table */}
            {expandedCategory && (
              <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4 mt-4`}>
                <h4 className={`text-md font-medium ${theme.textPrimary} mb-3`}>
                  Available Features in {expandedCategory}
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={`${theme.cardBorder} border-b`}>
                        <TableHead className={`${theme.textSecondary} font-medium`}>Feature</TableHead>
                        <TableHead className={`${theme.textSecondary} font-medium`}>OEM</TableHead>
                        <TableHead className={`${theme.textSecondary} font-medium`}>Business Model</TableHead>
                        <TableHead className={`${theme.textSecondary} font-medium`}>Lighthouse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFeaturesForCategory(expandedCategory).map((feature, index) => (
                        <TableRow key={index} className={`${theme.cardBorder} border-b hover:bg-gray-800/20`}>
                          <TableCell className={`${theme.textPrimary}`}>
                            {feature.feature}
                          </TableCell>
                          <TableCell className={`${theme.textSecondary}`}>
                            {feature.oem}
                          </TableCell>
                          <TableCell className={`${theme.textSecondary}`}>
                            {feature.businessModel || 'N/A'}
                          </TableCell>
                          <TableCell className={`${theme.textSecondary}`}>
                            {feature.lighthouseFeature?.toLowerCase() === 'yes' ? 'Yes' : 'No'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme.textMuted}`}>
            {selectedOEMs.length === 0 
              ? "Please select at least one OEM to view the analysis"
              : "No data available for the selected filters"
            }
          </div>
        )}
      </div>
    </div>
  )
}

const PassengerCarsAnalytics = () => {
  return (
    <PassengerCarsLayout>
      <CategoryAnalysisContent />
    </PassengerCarsLayout>
  )
}

export default PassengerCarsAnalytics
