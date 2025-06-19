
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWaypointData } from "@/hooks/useWaypointData"
import { Target } from "lucide-react"

interface BigBetCategoriesBoxProps {
  selectedOEM: string
  selectedCountry: string
}

const BigBetCategoriesBox = ({ selectedOEM, selectedCountry }: BigBetCategoriesBoxProps) => {
  const { data: waypointData } = useWaypointData()

  const categoryData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM || !selectedCountry) return []

    console.log('Processing big-bet categories for OEM:', selectedOEM, 'Country:', selectedCountry)
    
    const categoryCounts = new Map<string, number>()

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

          // Step 4: Extract category data
          const category = row.Category || row.category || row['Category '] || row[' Category']
          if (category && typeof category === 'string' && category.trim() !== '') {
            const categoryName = category.toString().trim()
            categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1)
            console.log('Found category:', categoryName, 'Total count:', categoryCounts.get(categoryName))
          }
        })
      }
    })

    console.log('Final category counts:', Array.from(categoryCounts.entries()))

    return Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [waypointData, selectedOEM, selectedCountry])

  return (
    <Card className="h-full bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-300 text-sm font-medium flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Big-bet Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categoryData.map((item, index) => (
            <div key={item.category} className="flex justify-between items-center">
              <span className="text-sm text-gray-300 truncate">{item.category}</span>
              <span className="text-white font-semibold ml-2">{item.count}</span>
            </div>
          ))}
          {categoryData.length === 0 && (
            <div className="text-gray-400 text-sm">No category data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default BigBetCategoriesBox
