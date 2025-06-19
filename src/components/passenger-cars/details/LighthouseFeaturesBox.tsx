
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { Star } from "lucide-react"

interface LighthouseFeaturesBoxProps {
  selectedOEM: string
  selectedCountry: string
}

const LighthouseFeaturesBox = ({ selectedOEM, selectedCountry }: LighthouseFeaturesBoxProps) => {
  const { data: waypointData } = useWaypointData()

  const featuresData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const features: string[] = []

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM === selectedOEM && 
              (!selectedCountry || row.Country === selectedCountry) &&
              row.Feature && typeof row.Feature === 'string') {
            
            features.push(row.Feature.trim())
          }
        })
      }
    })

    // Get unique features and take first 5 as "lighthouse" features
    const uniqueFeatures = Array.from(new Set(features))
    return uniqueFeatures.slice(0, 5)
  }, [waypointData, selectedOEM, selectedCountry])

  return (
    <Card className="h-full bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-purple-300 text-sm font-medium flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Lighthouse Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {featuresData.map((feature, index) => (
            <div key={index} className="text-sm text-gray-300 truncate">
              • {feature}
            </div>
          ))}
          {featuresData.length === 0 && (
            <div className="text-gray-400 text-sm">No feature data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LighthouseFeaturesBox
