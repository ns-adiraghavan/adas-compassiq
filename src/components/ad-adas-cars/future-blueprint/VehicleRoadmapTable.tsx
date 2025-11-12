import { useTheme } from "@/contexts/ThemeContext"
import { useVehicleRoadmapData } from "@/hooks/useVehicleRoadmapData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import OEMLogoCell from "@/components/ad-adas-cars/shared/OEMLogoCell"

interface VehicleRoadmapTableProps {
  selectedOEM: string
  parameterFilter: string
}

const VehicleRoadmapTable = ({ selectedOEM, parameterFilter }: VehicleRoadmapTableProps) => {
  const { theme } = useTheme()
  const { data, isLoading } = useVehicleRoadmapData("US", selectedOEM)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const vehicles = data?.vehicles || []

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-bold mb-6 ${theme.textPrimary}`}>Vehicle-Level Roadmap</h3>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${theme.textSecondary} text-lg`}>No vehicle roadmap data available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold min-w-[120px]">OEM</TableHead>
                {(parameterFilter === "All" || parameterFilter === "Vehicle Models") && (
                  <TableHead className="font-bold">Upcoming Vehicle Models</TableHead>
                )}
                {(parameterFilter === "All" || parameterFilter === "Vehicle Platforms") && (
                  <TableHead className="font-bold">Next-Gen Vehicle Platform</TableHead>
                )}
                {(parameterFilter === "All" || parameterFilter === "New Features") && (
                  <TableHead className="font-bold">New Features in Pipeline</TableHead>
                )}
                <TableHead className="font-bold">Strategic Roadmap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <OEMLogoCell oemName={vehicle.oem} />
                  </TableCell>
                  {(parameterFilter === "All" || parameterFilter === "Vehicle Models") && (
                    <TableCell className={theme.textSecondary}>
                      {vehicle.upcomingModels || "N/A"}
                    </TableCell>
                  )}
                  {(parameterFilter === "All" || parameterFilter === "Vehicle Platforms") && (
                    <TableCell className={theme.textSecondary}>
                      {vehicle.nextGenPlatform || "N/A"}
                    </TableCell>
                  )}
                  {(parameterFilter === "All" || parameterFilter === "New Features") && (
                    <TableCell className={theme.textSecondary}>
                      {vehicle.newFeatures || "N/A"}
                      {vehicle.strategicInitiatives && (
                        <div className="mt-2">
                          <Badge variant="outline" className="mb-1">Initiatives</Badge>
                          <p className="text-sm">{vehicle.strategicInitiatives}</p>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {vehicle.strategicRoadmap || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default VehicleRoadmapTable
