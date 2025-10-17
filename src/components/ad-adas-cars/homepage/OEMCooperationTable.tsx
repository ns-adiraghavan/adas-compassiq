import { useTheme } from "@/contexts/ThemeContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CooperationData {
  oem: string
  inHouse: string
  hardware: string
  softwareStack: string
  sensingPerception: string
}

const OEMCooperationTable = () => {
  const { theme } = useTheme()

  const cooperationData: CooperationData[] = [
    {
      oem: "Tesla",
      inHouse: "Full",
      hardware: "NVIDIA",
      softwareStack: "In-house",
      sensingPerception: "Tesla Vision"
    },
    {
      oem: "Rivian",
      inHouse: "Hybrid",
      hardware: "NVIDIA",
      softwareStack: "In-house + Partners",
      sensingPerception: "Multi-sensor"
    },
    {
      oem: "BMW",
      inHouse: "Hybrid",
      hardware: "Qualcomm, Intel",
      softwareStack: "Mixed",
      sensingPerception: "Continental, Bosch"
    },
    {
      oem: "General Motors",
      inHouse: "Hybrid",
      hardware: "Qualcomm",
      softwareStack: "Cruise + Ultifi",
      sensingPerception: "Multi-supplier"
    },
    {
      oem: "Ford",
      inHouse: "Supplier-led",
      hardware: "Qualcomm",
      softwareStack: "Argo AI (legacy)",
      sensingPerception: "Tier-1 suppliers"
    }
  ]

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full`}>
      <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>
        OEM Cooperation & Strategy
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={theme.textPrimary}>OEM</TableHead>
              <TableHead className={theme.textPrimary}>In House</TableHead>
              <TableHead className={theme.textPrimary}>Hardware</TableHead>
              <TableHead className={theme.textPrimary}>Software Stack</TableHead>
              <TableHead className={theme.textPrimary}>Sensing & Perception</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cooperationData.map((row) => (
              <TableRow key={row.oem} className="hover:bg-accent/5">
                <TableCell className={`font-medium ${theme.textPrimary}`}>
                  {row.oem}
                </TableCell>
                <TableCell className={theme.textSecondary}>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    row.inHouse === 'Full' ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                    row.inHouse === 'Hybrid' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                    'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                  }`}>
                    {row.inHouse}
                  </span>
                </TableCell>
                <TableCell className={theme.textSecondary}>{row.hardware}</TableCell>
                <TableCell className={theme.textSecondary}>{row.softwareStack}</TableCell>
                <TableCell className={theme.textSecondary}>{row.sensingPerception}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default OEMCooperationTable
