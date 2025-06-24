import { useEffect } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface OEMSelectorProps {
  selectedCountry: string
  selectedOEMs: string[]
  onOEMToggle: (oem: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  showSelectFirst3?: boolean
}

const OEMSelector = ({ 
  selectedCountry, 
  selectedOEMs, 
  onOEMToggle, 
  onSelectAll, 
  onClearAll,
  showSelectFirst3 = false
}: OEMSelectorProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

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

  const handleOEMToggle = (oem: string) => {
    // If trying to add a new OEM and already have 3 selected, don't allow it
    if (!selectedOEMs.includes(oem) && selectedOEMs.length >= 3) {
      return
    }
    onOEMToggle(oem)
  }

  const handleSelectAll = () => {
    // Only select the first 3 OEMs
    const oemsToSelect = availableOEMs.slice(0, 3)
    onSelectAll()
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-medium ${theme.textPrimary}`}>Select OEMs</h3>
          <p className={`text-sm ${theme.textMuted} mt-1`}>Maximum 3 OEMs can be selected</p>
        </div>
        <div className="flex gap-2">
          {showSelectFirst3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className={`${theme.textSecondary} border-gray-600 hover:bg-gray-800`}
            >
              Select First 3
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className={`${theme.textSecondary} border-gray-600 hover:bg-gray-800`}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-32 overflow-y-auto">
        {availableOEMs.map((oem) => {
          const isSelected = selectedOEMs.includes(oem)
          const isDisabled = !isSelected && selectedOEMs.length >= 3
          
          return (
            <div key={oem} className="flex items-center space-x-2">
              <Checkbox
                id={oem}
                checked={isSelected}
                disabled={isDisabled}
                onCheckedChange={() => handleOEMToggle(oem)}
              />
              <label
                htmlFor={oem}
                className={`text-sm cursor-pointer truncate ${
                  isDisabled 
                    ? `${theme.textMuted} opacity-50` 
                    : theme.textSecondary
                }`}
                title={oem}
              >
                {oem}
              </label>
            </div>
          )
        })}
      </div>
      
      <div className={`mt-3 text-sm ${theme.textMuted} flex justify-between items-center`}>
        <span>
          Selected: {selectedOEMs.length}/3 OEM{selectedOEMs.length !== 1 ? 's' : ''}
        </span>
        {selectedOEMs.length >= 3 && (
          <span className="text-amber-500 text-xs">
            Maximum limit reached
          </span>
        )}
      </div>
    </div>
  )
}

export default OEMSelector
