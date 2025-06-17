
import { Card } from "@/components/ui/card"

interface FeatureAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const FeatureAnalysis = ({ selectedOEM, selectedCountry }: FeatureAnalysisProps) => {
  const features = [
    { name: "Electric Powertrain", adoption: "45%", importance: "High" },
    { name: "Advanced Safety", adoption: "78%", importance: "Critical" },
    { name: "Connectivity", adoption: "65%", importance: "High" },
    { name: "Autonomous Features", adoption: "23%", importance: "Medium" }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Feature Adoption Analysis - {selectedOEM} ({selectedCountry})
        </h3>
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.name} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-white">{feature.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  feature.importance === 'Critical' ? 'bg-red-600' :
                  feature.importance === 'High' ? 'bg-orange-600' : 'bg-gray-600'
                }`}>
                  {feature.importance}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Adoption Rate</span>
                  <span className="text-blue-400 font-semibold">{feature.adoption}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: feature.adoption }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default FeatureAnalysis
