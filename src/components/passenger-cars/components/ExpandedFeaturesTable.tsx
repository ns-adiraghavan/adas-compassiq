
import { Check } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import FeatureTableLegend from "./FeatureTableLegend"

interface ExpandedFeaturesTableProps {
  expandedCategory: string
  expandedFeaturesData: Record<string, Record<string, { available: boolean, isLighthouse?: boolean, businessModel?: string }>>
  selectedOEMs: string[]
  showBusinessModelInDetails?: boolean
}

const ExpandedFeaturesTable = ({ 
  expandedCategory, 
  expandedFeaturesData, 
  selectedOEMs, 
  showBusinessModelInDetails = false 
}: ExpandedFeaturesTableProps) => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-6`}>
      <h4 className={`text-xl font-semibold ${theme.textPrimary} mb-4`}>
        Available Features in {expandedCategory}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${theme.cardBorder} border-b`}>
              <th className={`text-left p-4 ${theme.textPrimary} font-medium`}>Feature</th>
              {selectedOEMs.map(oem => (
                <th key={oem} className={`text-center p-4 ${theme.textPrimary} font-medium min-w-[120px]`}>
                  {oem}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(expandedFeaturesData).map(([featureName, oemData], index) => (
              <tr key={index} className={`${theme.cardBorder} border-b hover:${theme.cardBackground} transition-colors`}>
                <td className={`p-4 ${theme.textSecondary} font-medium`}>
                  {featureName}
                </td>
                {selectedOEMs.map(oem => {
                  const data = oemData[oem]
                  return (
                    <td key={oem} className={`p-4 text-center ${theme.textSecondary}`}>
                      {data ? (
                        <div className="flex items-center justify-center gap-2">
                          {data.isLighthouse ? (
                            // Green bordered circle with no fill and green checkmark for lighthouse features
                            <div className="flex items-center justify-center w-5 h-5 border-2 border-green-500 rounded-full bg-transparent">
                              <Check className="h-3 w-3 text-green-500 stroke-[3]" />
                            </div>
                          ) : (
                            // Green circle without checkmark for regular available features
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          )}
                          {showBusinessModelInDetails && data.businessModel && (
                            <span className="text-xs text-gray-500">
                              {data.businessModel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FeatureTableLegend />
    </div>
  )
}

export default ExpandedFeaturesTable
