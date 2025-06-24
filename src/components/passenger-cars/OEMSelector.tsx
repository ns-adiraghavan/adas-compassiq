
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
}

const OEMSelector = ({ 
  selectedCountry, 
  selectedOEMs, 
  onOEMToggle, 
  onSelectAll, 
  onClearAll 
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

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-5 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-medium ${theme.textPrimary}`}>Select OEMs</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className={`${theme.textSecondary} border-gray-600 hover:bg-gray-800`}
          >
            Select All
          </Button>
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
        {availableOEMs.map((oem) => (
          <div key={oem} className="flex items-center space-x-2">
            <Checkbox
              id={oem}
              checked={selectedOEMs.includes(oem)}
              onCheckedChange={() => onOEMToggle(oem)}
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
  )
}

export default OEMSelector
