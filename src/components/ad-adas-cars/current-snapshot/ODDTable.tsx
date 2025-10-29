import { useTheme } from "@/contexts/ThemeContext"
import { useODDData } from "@/hooks/useODDData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import OEMLogoCell from "../shared/OEMLogoCell"

interface ODDTableProps {
  selectedRegion: string
  selectedCategory: string
}

const ODDTable = ({ selectedRegion, selectedCategory }: ODDTableProps) => {
  const { theme } = useTheme()
  const { data: oddData, isLoading } = useODDData(selectedRegion, selectedCategory)

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
      <h3 className="text-xl font-bold mb-4">Operational Design Domain (ODD)</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">OEM</TableHead>
              <TableHead className="font-bold">Geographic Area</TableHead>
              <TableHead className="font-bold">Max Operating Speed Range (miles/h - mph)</TableHead>
              <TableHead className="font-bold">Road Network for L2+ and Higher Driving Functionality (in Miles)</TableHead>
              <TableHead className="font-bold">Key Regulatory Approvals/Endorsements</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oddData && oddData.length > 0 ? (
              oddData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <OEMLogoCell oemName={row.oem} />
                  </TableCell>
                  <TableCell>{row.geographicArea}</TableCell>
                  <TableCell>{row.maxOperatingSpeed}</TableCell>
                  <TableCell>{row.roadNetwork}</TableCell>
                  <TableCell>{row.keyRegulatory}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No ODD data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ODDTable
