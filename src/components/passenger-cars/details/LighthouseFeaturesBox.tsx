
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
    if (!waypointData?.csvData?.length || !selectedOEM || !selectedCountry) return []

    console.log('Processing lighthouse features for OEM:', selectedOEM, 'Country:', selectedCountry)
    
    const features: string[] = []

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          // Step 1: Filter by selected country first
          const country = row.Country || row.country || row['Country '] || row[' Country']
          if (!country || country.toString().trim() !== selectedCountry) return

          // Step 2: Filter by availability = "Available"
          const featureAvailability = row['Feature Availability'] || 
                                    row['Available Feature'] || 
                                    row['Available_Feature'] || 
                                    row.available_feature || 
                                    row.AvailableFeature ||
                                    row['feature_availability'] ||
                                    row['FEATURE AVAILABILITY']

          if (!featureAvailability || 
              featureAvailability.toString().trim().toLowerCase() !== 'available') return

          // Step 3: Filter by selected OEM
          const oem = row.OEM || row.oem || row['OEM '] || row[' OEM']
          if (!oem || oem.toString().trim() !== selectedOEM) return

          // Step 4: Extract lighthouse features (marked as lighthouse)
          const lighthouseFeature = row['Lighthouse Feature'] || 
                                   row['lighthouse_feature'] || 
                                   row['LighthouseFeature'] ||
                                   row['LIGHTHOUSE FEATURE']

          if (lighthouseFeature && 
              lighthouseFeature.toString().trim().toLowerCase() === 'yes') {
            
            const feature = row.Feature || row.feature || row['Feature '] || row[' Feature']
            if (feature && typeof feature === 'string' && feature.trim() !== '') {
              features.push(feature.toString().trim())
              console.log('Found lighthouse feature:', feature.toString().trim())
            }
          }
        })
      }
    })

    console.log('Final lighthouse features count:', features.length)

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
            <div className="text-gray-400 text-sm">No lighthouse features available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LighthouseFeaturesBox
