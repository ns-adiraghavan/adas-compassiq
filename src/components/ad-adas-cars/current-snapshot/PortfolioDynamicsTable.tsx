import { useTheme } from "@/contexts/ThemeContext"
import { usePortfolioDynamicsData } from "@/hooks/usePortfolioDynamicsData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface PortfolioDynamicsTableProps {
  selectedRegion: string
  selectedCategory: string
}

const PortfolioDynamicsTable = ({ selectedRegion, selectedCategory }: PortfolioDynamicsTableProps) => {
  const { theme } = useTheme()
  const { data: portfolioData, isLoading } = usePortfolioDynamicsData(selectedRegion, selectedCategory)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className="text-xl font-bold mb-4">Vehicle Portfolio Dynamics for AV Platform</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">OEM</TableHead>
              <TableHead className="font-bold">Models Equipped with L2+ and Above Autonomy</TableHead>
              <TableHead className="font-bold">Most Advanced AV Model</TableHead>
              <TableHead className="font-bold">Sales of Most Advanced AV Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioData && portfolioData.length > 0 ? (
              portfolioData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.oem}</TableCell>
                  <TableCell>{row.modelsEquipped}</TableCell>
                  <TableCell>{row.mostAdvancedModel}</TableCell>
                  <TableCell>{row.salesOfAdvancedModel}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No portfolio dynamics data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default PortfolioDynamicsTable
