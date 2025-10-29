import { useTheme } from "@/contexts/ThemeContext"
import { useComputationalCoreData } from "@/hooks/useComputationalCoreData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import OEMLogoCell from "../shared/OEMLogoCell"

interface ComputationalCoreTableProps {
  selectedRegion: string
  selectedCategory: string
}

const ComputationalCoreTable = ({ selectedRegion, selectedCategory }: ComputationalCoreTableProps) => {
  const { theme } = useTheme()
  const { data: result, isLoading, error } = useComputationalCoreData(selectedRegion, selectedCategory)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
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

  const data = result?.data || []
  const oems = result?.oems || []

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h2 className="text-2xl font-bold mb-6">Computational Core</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold min-w-[200px]">Parameter</TableHead>
              {oems.map((oem) => (
                <TableHead key={oem} className="font-bold min-w-[200px]">
                  <div className="flex justify-center">
                    <OEMLogoCell oemName={oem} showName={false} />
                  </div>
                  <div className="mt-1">{oem}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.parameter}>
                <TableCell className="font-medium">{row.parameter}</TableCell>
                {oems.map((oem) => (
                  <TableCell key={oem}>
                    {row.oemValues[oem] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length === 0 && (
        <div className={`text-center ${theme.textMuted} py-12`}>
          <p className="text-lg">No data available</p>
        </div>
      )}
    </div>
  )
}

export default ComputationalCoreTable
