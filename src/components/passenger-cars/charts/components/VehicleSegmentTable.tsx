
import { useTheme } from "@/contexts/ThemeContext"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentTableProps {
  availableSegments: string[]
  selectedOEMs: string[]
  groupingMode: GroupingMode
  segmentFeatureMap?: Map<string, Map<string, number>>
  oemFeatureMap?: Map<string, Map<string, number>>
}

const VehicleSegmentTable = ({ 
  availableSegments, 
  selectedOEMs, 
  groupingMode, 
  segmentFeatureMap, 
  oemFeatureMap 
}: VehicleSegmentTableProps) => {
  const { theme } = useTheme()

  if (groupingMode === 'by-oem') {
    return (
      <div className="overflow-x-auto">
        <table className={`w-full ${theme.cardBorder} border rounded-lg`}>
          <thead className={`${theme.cardBackground}`}>
            <tr>
              <th className={`px-4 py-2 text-left ${theme.textPrimary}`}>OEM</th>
              {availableSegments.map(segment => (
                <th key={segment} className={`px-4 py-2 text-center ${theme.textPrimary}`}>
                  {segment}
                </th>
              ))}
              <th className={`px-4 py-2 text-center ${theme.textPrimary}`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {selectedOEMs.map(oem => {
              const oemSegments = oemFeatureMap?.get(oem) || new Map()
              const total = availableSegments.reduce((sum, segment) => sum + (oemSegments.get(segment) || 0), 0)
              return (
                <tr key={oem} className={`${theme.cardBorder} border-t`}>
                  <td className={`px-4 py-2 font-medium ${theme.textPrimary}`}>{oem}</td>
                  {availableSegments.map(segment => (
                    <td key={segment} className={`px-4 py-2 text-center ${theme.textSecondary}`}>
                      {oemSegments.get(segment) || 0}
                    </td>
                  ))}
                  <td className={`px-4 py-2 text-center font-medium ${theme.textPrimary}`}>
                    {total}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <div className="overflow-x-auto">
        <table className={`w-full ${theme.cardBorder} border rounded-lg`}>
          <thead className={`${theme.cardBackground}`}>
            <tr>
              <th className={`px-4 py-2 text-left ${theme.textPrimary}`}>Segment</th>
              {selectedOEMs.map(oem => (
                <th key={oem} className={`px-4 py-2 text-center ${theme.textPrimary}`}>
                  {oem}
                </th>
              ))}
              <th className={`px-4 py-2 text-center ${theme.textPrimary}`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {availableSegments.map(segment => {
              const segmentOEMs = segmentFeatureMap?.get(segment) || new Map()
              const total = selectedOEMs.reduce((sum, oem) => sum + (segmentOEMs.get(oem) || 0), 0)
              return (
                <tr key={segment} className={`${theme.cardBorder} border-t`}>
                  <td className={`px-4 py-2 font-medium ${theme.textPrimary}`}>{segment}</td>
                  {selectedOEMs.map(oem => (
                    <td key={oem} className={`px-4 py-2 text-center ${theme.textSecondary}`}>
                      {segmentOEMs.get(oem) || 0}
                    </td>
                  ))}
                  <td className={`px-4 py-2 text-center font-medium ${theme.textPrimary}`}>
                    {total}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default VehicleSegmentTable
