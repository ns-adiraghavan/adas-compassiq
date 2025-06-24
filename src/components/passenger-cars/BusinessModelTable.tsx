
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"

interface BusinessModelTableProps {
  selectedCountry: string
  selectedOEMs: string[]
  onBusinessModelClick: (businessModel: string) => void
}

const BusinessModelTable = ({ selectedCountry, selectedOEMs, onBusinessModelClick }: BusinessModelTableProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  const tableData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { businessModels: [], oemTotals: {} }
    }

    const businessModelData: Record<string, Record<string, number>> = {}
    const oemTotals: Record<string, number> = {}
    const allBusinessModels = new Set<string>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const businessModelType = row['Business Model Type']?.toString().trim() || 'Unknown'
            const oem = row.OEM?.toString().trim()
            
            allBusinessModels.add(businessModelType)
            
            if (!businessModelData[businessModelType]) {
              businessModelData[businessModelType] = {}
            }
            
            businessModelData[businessModelType][oem] = (businessModelData[businessModelType][oem] || 0) + 1
            oemTotals[oem] = (oemTotals[oem] || 0) + 1
          }
        })
      }
    })

    const businessModels = Array.from(allBusinessModels).map(businessModel => {
      const row: any = { name: businessModel }
      let total = 0
      selectedOEMs.forEach(oem => {
        const count = businessModelData[businessModel]?.[oem] || 0
        row[oem] = count
        total += count
      })
      row.total = total
      return row
    }).filter(row => row.total > 0).sort((a, b) => b.total - a.total)

    return { businessModels, oemTotals }
  }, [waypointData, selectedCountry, selectedOEMs])

  const getCellColor = (value: number, maxInRow: number) => {
    if (value === 0) return 'transparent'
    const intensity = value / maxInRow
    if (intensity > 0.7) return 'rgba(59, 130, 246, 0.8)' // Strong blue
    if (intensity > 0.4) return 'rgba(59, 130, 246, 0.5)' // Medium blue
    return 'rgba(59, 130, 246, 0.3)' // Light blue
  }

  if (tableData.businessModels.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className={`${theme.textMuted}`}>No data available for selected filters</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${theme.cardBorder} border-b`}>
            <th className={`text-left p-3 ${theme.textPrimary} font-medium`}>Business Model Type</th>
            {selectedOEMs.map(oem => (
              <th key={oem} className={`text-center p-3 ${theme.textPrimary} font-medium min-w-[100px]`}>
                {oem}
              </th>
            ))}
            <th className={`text-center p-3 ${theme.textPrimary} font-medium`}>Total</th>
          </tr>
        </thead>
        <tbody>
          {tableData.businessModels.map((row, index) => {
            const maxInRow = Math.max(...selectedOEMs.map(oem => row[oem] || 0))
            return (
              <tr 
                key={row.name} 
                className={`${theme.cardBorder} border-b hover:${theme.cardBackground} cursor-pointer transition-colors`}
                onClick={() => onBusinessModelClick(row.name)}
              >
                <td className={`p-3 ${theme.textSecondary} font-medium`}>
                  {row.name}
                </td>
                {selectedOEMs.map(oem => {
                  const value = row[oem] || 0
                  return (
                    <td 
                      key={oem} 
                      className="p-3 text-center font-semibold"
                      style={{ 
                        backgroundColor: getCellColor(value, maxInRow),
                        color: value > 0 ? 'white' : 'rgba(255,255,255,0.4)'
                      }}
                    >
                      {value > 0 ? value : '-'}
                    </td>
                  )
                })}
                <td className={`p-3 text-center font-bold ${theme.textPrimary}`}>
                  {row.total}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BusinessModelTable
