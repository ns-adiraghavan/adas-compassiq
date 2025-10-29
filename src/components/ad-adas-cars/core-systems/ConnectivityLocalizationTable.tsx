import { useTheme } from "@/contexts/ThemeContext"
import { useConnectivityLocalizationData } from "@/hooks/useConnectivityLocalizationData"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Wifi, Radio, Map, Navigation, TrafficCone, Eye, MessageCircle } from "lucide-react"
import OEMLogoCell from "../shared/OEMLogoCell"

interface ConnectivityLocalizationTableProps {
  selectedRegion: string
  selectedCategory: string
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Vision & Perception':
      return <Eye className="h-5 w-5 text-chart-1" />
    case 'Communication':
      return <Radio className="h-5 w-5 text-chart-2" />
    case 'Mapping & Localization':
      return <Navigation className="h-5 w-5 text-chart-3" />
    default:
      return null
  }
}

const getParameterIcon = (parameter: string) => {
  if (parameter.includes('Traffic') || parameter.includes('Sign')) {
    return <TrafficCone className="h-4 w-4 text-muted-foreground" />
  }
  if (parameter.includes('Communication') || parameter.includes('Network')) {
    return <Wifi className="h-4 w-4 text-muted-foreground" />
  }
  if (parameter.includes('Map')) {
    return <Map className="h-4 w-4 text-muted-foreground" />
  }
  if (parameter.includes('Data Transfer')) {
    return <MessageCircle className="h-4 w-4 text-muted-foreground" />
  }
  return null
}

const ConnectivityLocalizationTable = ({ selectedRegion, selectedCategory }: ConnectivityLocalizationTableProps) => {
  const { theme } = useTheme()
  const { data: result, isLoading, error } = useConnectivityLocalizationData(selectedRegion, selectedCategory)

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

  // Group data by category
  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.category]) {
      acc[row.category] = []
    }
    acc[row.category].push(row)
    return acc
  }, {} as Record<string, typeof data>)

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h2 className="text-2xl font-bold mb-6">Connectivity & Localization</h2>
      
      <div className="space-y-8">
        {Object.entries(groupedData).map(([category, rows]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {getCategoryIcon(category)}
              <h3 className="text-xl font-semibold">{category}</h3>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold min-w-[250px]">Parameter</TableHead>
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
                  {rows.map((row) => (
                    <TableRow key={row.parameter}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getParameterIcon(row.parameter)}
                          <span>{row.parameter}</span>
                        </div>
                      </TableCell>
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
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className={`text-center ${theme.textMuted} py-12`}>
          <p className="text-lg">No data available</p>
        </div>
      )}
    </div>
  )
}

export default ConnectivityLocalizationTable
