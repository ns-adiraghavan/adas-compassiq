
import { Card } from "@/components/ui/card"

interface CategoryAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const CategoryAnalysis = ({ selectedOEM, selectedCountry }: CategoryAnalysisProps) => {
  const categories = [
    { name: "Compact Cars", share: "32%", trend: "+5%" },
    { name: "Mid-size Sedans", share: "28%", trend: "-2%" },
    { name: "SUVs", share: "35%", trend: "+8%" },
    { name: "Luxury Vehicles", share: "5%", trend: "+3%" }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Category Performance - {selectedOEM} ({selectedCountry})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white">{category.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-2xl font-bold text-blue-400">{category.share}</span>
                <span className={`text-sm ${
                  category.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {category.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default CategoryAnalysis
