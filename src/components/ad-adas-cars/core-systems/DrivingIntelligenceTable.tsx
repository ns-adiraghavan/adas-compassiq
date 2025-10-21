import { useTheme } from "@/contexts/ThemeContext"
import { useDrivingIntelligenceData } from "@/hooks/useDrivingIntelligenceData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface DrivingIntelligenceTableProps {
  selectedRegion: string
  selectedCategory: string
}

const DrivingIntelligenceTable = ({ selectedRegion, selectedCategory }: DrivingIntelligenceTableProps) => {
  const { theme } = useTheme()
  const { data, isLoading, error } = useDrivingIntelligenceData(selectedRegion, selectedCategory)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <p className="text-red-400">Error loading data</p>
      </div>
    )
  }

  const { data: tableData, oems } = data || { data: [], oems: [] }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h2 className="text-2xl font-bold mb-6">Driving Intelligence - Software Architecture</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10">
              <TableHead className="font-bold text-white min-w-[200px]">Parameter</TableHead>
              {oems.map((oem) => (
                <TableHead key={oem} className="font-bold text-white text-center min-w-[150px]">
                  {oem}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <TableCell className="font-medium text-white/90">
                  {row.parameter}
                </TableCell>
                {oems.map((oem) => (
                  <TableCell 
                    key={oem} 
                    className="text-center text-white/70 text-sm"
                  >
                    {row.oemValues[oem] || '-'}
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

export default DrivingIntelligenceTable
