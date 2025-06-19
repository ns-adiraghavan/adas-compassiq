
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
    if (!waypointData?.csvData?.length) return []

    const categoryCounts = new Map<string, number>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM === selectedOEM && 
              (!selectedCountry || row.Country === selectedCountry) &&
              row.Category && typeof row.Category === 'string') {
            
            const category = row.Category.trim()
            categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
          }
        })
      }
    })

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
