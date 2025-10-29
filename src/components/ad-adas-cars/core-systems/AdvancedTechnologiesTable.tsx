import { useTheme } from "@/contexts/ThemeContext"
import { useAdvancedTechnologiesData } from "@/hooks/useAdvancedTechnologiesData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import OEMLogoCell from "../shared/OEMLogoCell"

interface AdvancedTechnologiesTableProps {
  selectedRegion: string
  selectedCategory: string
}

const AdvancedTechnologiesTable = ({ selectedRegion, selectedCategory }: AdvancedTechnologiesTableProps) => {
  const { theme } = useTheme()
  const { data, isLoading, error } = useAdvancedTechnologiesData(selectedRegion, selectedCategory)

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

  if (!data || data.data.length === 0) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <p className={theme.textMuted}>No data available</p>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl ${theme.shadowColor} shadow-lg backdrop-blur-sm overflow-hidden`}>
      <div className="p-6 border-b border-slate-700/50">
        <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Advanced Technologies</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={theme.cardBorder}>
              <TableHead className={`${theme.textPrimary} font-bold sticky left-0 ${theme.cardBackground} z-10`}>
                Parameter
              </TableHead>
              {data.oems.map((oem) => (
                <TableHead key={oem} className={`${theme.textPrimary} font-bold text-center min-w-[200px]`}>
                  <div className="flex justify-center">
                    <OEMLogoCell oemName={oem} showName={false} />
                  </div>
                  <div className="mt-1">{oem}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((row, idx) => (
              <TableRow key={idx} className={`${theme.cardBorder} ${theme.hoverEffect}`}>
                <TableCell className={`${theme.textSecondary} font-medium sticky left-0 ${theme.cardBackground} z-10`}>
                  {row.parameter}
                </TableCell>
                {data.oems.map((oem) => (
                  <TableCell key={oem} className={`${theme.textSecondary} text-center`}>
                    {row[oem] || "-"}
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

export default AdvancedTechnologiesTable
