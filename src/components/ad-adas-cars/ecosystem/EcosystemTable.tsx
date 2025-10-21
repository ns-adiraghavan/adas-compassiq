import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useEcosystemData } from "@/hooks/useEcosystemData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useOEMLogo } from "@/hooks/useOEMLogo"

interface EcosystemTableProps {
  selectedRegion: string
  selectedCategory: string
}

const parameters = ["Sensorics", "Hardware", "Software", "Advanced Tech"]

const EcosystemTable = ({ selectedRegion, selectedCategory }: EcosystemTableProps) => {
  const { theme } = useTheme()
  const [selectedParameter, setSelectedParameter] = useState("Sensorics")
  const { data, isLoading, error } = useEcosystemData(selectedRegion, selectedCategory, selectedParameter)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    )
  }

  if (!data || data.oems.length === 0) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <p className={theme.textMuted}>No data available</p>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl ${theme.shadowColor} shadow-lg backdrop-blur-sm overflow-hidden`}>
      <div className="p-6 border-b border-slate-700/50">
        <h2 className={`text-xl font-bold ${theme.textPrimary} mb-4`}>OEM Partner Ecosystem</h2>
        
        {/* Parameter Selector */}
        <div className="flex gap-2 mb-4">
          <span className={`${theme.textSecondary} font-medium mr-2`}>Parameters</span>
          {parameters.map((param) => (
            <button
              key={param}
              onClick={() => setSelectedParameter(param)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedParameter === param
                  ? 'bg-cyan-600 text-white'
                  : `${theme.cardBackground} ${theme.textSecondary} ${theme.hoverEffect}`
              }`}
            >
              {param}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={theme.cardBorder}>
              <TableHead className={`${theme.textPrimary} font-bold sticky left-0 ${theme.cardBackground} z-10`}>
                OEM
              </TableHead>
              {data.columnAttributes.map((attr) => (
                <TableHead key={attr} className={`${theme.textPrimary} font-bold text-center min-w-[200px]`}>
                  {attr}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.oems.map((oem) => (
              <TableRow key={oem} className={`${theme.cardBorder} ${theme.hoverEffect}`}>
                <TableCell className={`${theme.textSecondary} font-medium sticky left-0 ${theme.cardBackground} z-10`}>
                  <OEMLogoCell oemName={oem} />
                </TableCell>
                {data.columnAttributes.map((attr) => (
                  <TableCell key={attr} className={`${theme.textSecondary} text-center align-top`}>
                    <div className="space-y-2">
                      {data.oemData[oem]?.[attr]?.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{item.supplier}</div>
                          {item.strategy && (
                            <div className="text-xs opacity-75">Strategy: {item.strategy}</div>
                          )}
                          {item.type && (
                            <div className="text-xs opacity-60">{item.type}</div>
                          )}
                        </div>
                      )) || "-"}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Helper component for OEM logo
const OEMLogoCell = ({ oemName }: { oemName: string }) => {
  const { data: logoUrl, isLoading } = useOEMLogo(oemName)

  if (isLoading) {
    return <div className="text-sm">{oemName}</div>
  }

  if (logoUrl) {
    return (
      <div className="flex items-center gap-2">
        <img src={logoUrl} alt={oemName} className="h-8 w-auto object-contain" />
        <span className="text-sm">{oemName}</span>
      </div>
    )
  }

  return <div className="text-sm">{oemName}</div>
}

export default EcosystemTable
