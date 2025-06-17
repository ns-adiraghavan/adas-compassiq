
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { Globe, Users, TrendingUp, MapPin } from "lucide-react"
import { useMemo } from "react"

interface OEMMarketPresenceProps {
  selectedOEM: string
}

const OEMMarketPresence = ({ selectedOEM }: OEMMarketPresenceProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const marketPresence = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM) return null

    const oemData = new Set<string>()
    const competitorData: Record<string, Set<string>> = {}
    let totalFeatures = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          const rowCountry = row.Country?.trim()
          
          if (rowOEM && rowCountry && rowCountry !== 'n/a') {
            if (rowOEM === selectedOEM) {
              oemData.add(rowCountry)
              totalFeatures++
            } else {
              if (!competitorData[rowOEM]) competitorData[rowOEM] = new Set()
              competitorData[rowOEM].add(rowCountry)
            }
          }
        })
      }
    })

    const countries = Array.from(oemData)
    const averageCompetitorPresence = Object.values(competitorData).reduce((sum, countries) => sum + countries.size, 0) / Object.keys(competitorData).length

    return {
      countries,
      totalCountries: countries.length,
      totalFeatures,
      averageCompetitorPresence: Math.round(averageCompetitorPresence),
      marketPenetration: Math.round((countries.length / 8) * 100) // assuming 8 total countries in data
    }
  }, [waypointData, selectedOEM])

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/10 rounded"></div>)}
          </div>
        </div>
      </Card>
    )
  }

  if (!marketPresence) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <p className="text-white/60">No market presence data available for {selectedOEM}</p>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-light text-white">{selectedOEM} Market Presence Overview</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <MapPin className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{marketPresence.totalCountries}</p>
          <p className="text-white/60 text-sm">Global Markets</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{marketPresence.totalFeatures}</p>
          <p className="text-white/60 text-sm">Total Features</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{marketPresence.marketPenetration}%</p>
          <p className="text-white/60 text-sm">Market Penetration</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Globe className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{marketPresence.averageCompetitorPresence}</p>
          <p className="text-white/60 text-sm">Avg Competitor Reach</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-white mb-3">Active Markets</h4>
        <div className="flex flex-wrap gap-2">
          {marketPresence.countries.map(country => (
            <span key={country} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
              {country}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default OEMMarketPresence
