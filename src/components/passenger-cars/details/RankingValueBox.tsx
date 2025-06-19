
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { TrendingUp } from "lucide-react"

interface RankingValueBoxProps {
  selectedOEM: string
  selectedCountry: string
}

const RankingValueBox = ({ selectedOEM, selectedCountry }: RankingValueBoxProps) => {
  const { data: waypointData } = useWaypointData()

  const rankingData = useMemo(() => {
    if (!waypointData?.csvData?.length) return { rank: 0, totalFeatures: 0, totalOEMs: 0 }

    const oemCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM && typeof row.OEM === 'string' && 
              !row.OEM.toLowerCase().includes('merged') &&
              !row.OEM.toLowerCase().includes('monitoring')) {
            
            if (selectedCountry && row.Country !== selectedCountry) return

            const oem = row.OEM.trim()
            oemCounts.set(oem, (oemCounts.get(oem) || 0) + 1)
          }
        })
      }
    })

    const sortedOEMs = Array.from(oemCounts.entries())
      .sort((a, b) => b[1] - a[1])

    const rank = sortedOEMs.findIndex(([oem]) => oem === selectedOEM) + 1
    const totalFeatures = oemCounts.get(selectedOEM) || 0
    const totalOEMs = oemCounts.size

    return { rank, totalFeatures, totalOEMs }
  }, [waypointData, selectedOEM, selectedCountry])

  return (
    <Card className="h-full bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-300 text-sm font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Market Ranking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-white">#{rankingData.rank}</div>
            <div className="text-sm text-gray-400">out of {rankingData.totalOEMs} OEMs</div>
          </div>
          <div>
            <div className="text-xl font-semibold text-white">{rankingData.totalFeatures}</div>
            <div className="text-sm text-gray-400">Total Features</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RankingValueBox
