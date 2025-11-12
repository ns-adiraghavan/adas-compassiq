import { useTheme } from "@/contexts/ThemeContext"
import { useKeyTechnologyInvestmentsData } from "@/hooks/useKeyTechnologyInvestmentsData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import OEMLogoCell from "@/components/ad-adas-cars/shared/OEMLogoCell"

interface KeyTechnologyInvestmentsTableProps {
  selectedOEM: string
  selectedInvestmentType: string
}

const KeyTechnologyInvestmentsTable = ({ selectedOEM, selectedInvestmentType }: KeyTechnologyInvestmentsTableProps) => {
  const { theme } = useTheme()
  const { data, isLoading } = useKeyTechnologyInvestmentsData("US", selectedOEM, selectedInvestmentType)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const investments = data?.investments || []

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-bold mb-6 ${theme.textPrimary}`}>Key Technology Investments</h3>
      
      {investments.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${theme.textSecondary} text-lg`}>No investment data available for the selected filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold min-w-[120px]">OEM</TableHead>
                <TableHead className="font-bold">Investment Type</TableHead>
                <TableHead className="font-bold">Investment Amount/Agreements</TableHead>
                <TableHead className="font-bold">Investment Trends</TableHead>
                <TableHead className="font-bold">AV Specific Subsidies</TableHead>
                <TableHead className="font-bold">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <OEMLogoCell oemName={investment.oem} />
                  </TableCell>
                  <TableCell className={theme.textSecondary}>{investment.subAttribute}</TableCell>
                  <TableCell className="font-medium">{investment.value}</TableCell>
                  <TableCell className={theme.textSecondary}>{investment.investmentTrends || "N/A"}</TableCell>
                  <TableCell className={theme.textSecondary}>{investment.subsidies || "N/A"}</TableCell>
                  <TableCell className={theme.textSecondary}>{investment.location || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default KeyTechnologyInvestmentsTable
