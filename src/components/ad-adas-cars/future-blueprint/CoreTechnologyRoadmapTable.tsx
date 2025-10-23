import { useTheme } from "@/contexts/ThemeContext"
import { useCoreTechnologyRoadmapData } from "@/hooks/useCoreTechnologyRoadmapData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import teslaLogo from "@/assets/oem-logos/tesla_logo.png"
import rivianLogo from "@/assets/oem-logos/rivian_logo.png"
import bmwLogo from "@/assets/oem-logos/bmw_logo.png"
import gmLogo from "@/assets/oem-logos/gm_logo.png"
import fordLogo from "@/assets/oem-logos/ford_logo.png"

const OEM_LOGOS: Record<string, string> = {
  'tesla': teslaLogo,
  'rivian': rivianLogo,
  'bmw': bmwLogo,
  'gm': gmLogo,
  'general motors': gmLogo,
  'ford': fordLogo,
}

const getOEMLogo = (oemName: string): string => {
  const normalizedName = oemName.toLowerCase().trim()
  return OEM_LOGOS[normalizedName] || ""
}

interface CoreTechnologyRoadmapTableProps {
  selectedOEM: string
  categoryFilter: string
}

const CoreTechnologyRoadmapTable = ({ selectedOEM, categoryFilter }: CoreTechnologyRoadmapTableProps) => {
  const { theme } = useTheme()
  const { data, isLoading } = useCoreTechnologyRoadmapData("US", selectedOEM)

  if (isLoading) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const technologies = data?.technologies || []

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-bold mb-6 ${theme.textPrimary}`}>Core Technology Roadmap</h3>
      
      {technologies.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${theme.textSecondary} text-lg`}>No technology roadmap data available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold min-w-[120px]">OEM</TableHead>
                {(categoryFilter === "All" || categoryFilter === "Hardware") && (
                  <>
                    <TableHead className="font-bold">Current Standing - Hardware</TableHead>
                    <TableHead className="font-bold">Future Aspiration - Hardware</TableHead>
                  </>
                )}
                {(categoryFilter === "All" || categoryFilter === "Software") && (
                  <>
                    <TableHead className="font-bold">Current Standing - Software</TableHead>
                    <TableHead className="font-bold">Future Aspiration - Software</TableHead>
                  </>
                )}
                {(categoryFilter === "All" || categoryFilter === "AI Integration") && (
                  <TableHead className="font-bold">AI Integration</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {technologies.map((tech, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getOEMLogo(tech.oem) && (
                        <img 
                          src={getOEMLogo(tech.oem)} 
                          alt={`${tech.oem} logo`}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <span className="font-medium">{tech.oem}</span>
                    </div>
                  </TableCell>
                  {(categoryFilter === "All" || categoryFilter === "Hardware") && (
                    <>
                      <TableCell className={theme.textSecondary}>
                        <div className="space-y-1">
                          {tech.sensingPerception && (
                            <div>
                              <Badge variant="outline" className="mb-1">Sensing</Badge>
                              <p className="text-sm">{tech.sensingPerception}</p>
                            </div>
                          )}
                          {tech.computingHardware && (
                            <div className="mt-2">
                              <Badge variant="outline" className="mb-1">Computing</Badge>
                              <p className="text-sm">{tech.computingHardware}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {tech.hardwareAspiration || "N/A"}
                      </TableCell>
                    </>
                  )}
                  {(categoryFilter === "All" || categoryFilter === "Software") && (
                    <>
                      <TableCell className={theme.textSecondary}>
                        {tech.systemSoftware || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tech.softwareAspiration || "N/A"}
                      </TableCell>
                    </>
                  )}
                  {(categoryFilter === "All" || categoryFilter === "AI Integration") && (
                    <TableCell className={theme.textSecondary}>
                      {tech.aiIntegration || "N/A"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default CoreTechnologyRoadmapTable
