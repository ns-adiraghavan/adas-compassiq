import { useTheme } from "@/contexts/ThemeContext"
import { useAVLandscapeData } from "@/hooks/useAVLandscapeData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface AVLandscapeTableProps {
  selectedRegion: string
  selectedCategory: string
}

const AVLandscapeTable = ({ selectedRegion, selectedCategory }: AVLandscapeTableProps) => {
  const { theme } = useTheme()
  const { data: platformData, isLoading } = useAVLandscapeData(selectedRegion, selectedCategory)
  console.log('AVLandscapeTable rows:', platformData?.length, platformData)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>
        AV Platform Landscape
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={theme.cardBorder}>
              <TableHead className={`${theme.textPrimary} font-semibold`}>OEM</TableHead>
              <TableHead className={`${theme.textPrimary} font-semibold`}>Platform Name</TableHead>
              <TableHead className={`${theme.textPrimary} font-semibold`}>
                Maximum Autonomy Level Deployed in Vehicles
              </TableHead>
              <TableHead className={`${theme.textPrimary} font-semibold`}>
                Platform Variants with L2+ and Above Capability
              </TableHead>
              <TableHead className={`${theme.textPrimary} font-semibold`}>
                Most Advanced Variant of AV Platform
              </TableHead>
              <TableHead className={`${theme.textPrimary} font-semibold`}>
                Level of Driver Intervention in Most Advanced AV Platform
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platformData && platformData.length > 0 ? (
              platformData.map((row, index) => (
                <TableRow key={index} className={theme.cardBorder}>
                  <TableCell className={`font-medium ${theme.textPrimary}`}>{row.oem}</TableCell>
                  <TableCell className={theme.textSecondary}>{row.platformName}</TableCell>
                  <TableCell className={theme.textSecondary}>{row.maxAutonomyLevel}</TableCell>
                  <TableCell className={theme.textSecondary}>{row.platformVariants}</TableCell>
                  <TableCell className={theme.textSecondary}>{row.mostAdvancedVariant}</TableCell>
                  <TableCell className={theme.textSecondary}>{row.driverIntervention}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className={`text-center ${theme.textMuted} py-8`}>
                  No AV platform data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AVLandscapeTable
