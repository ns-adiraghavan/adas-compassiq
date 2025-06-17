
import { Card } from "@/components/ui/card"

interface BusinessModelAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const BusinessModelAnalysis = ({ selectedOEM, selectedCountry }: BusinessModelAnalysisProps) => {
  const businessModels = [
    { 
      name: "Traditional Sales", 
      share: "65%", 
      description: "Direct vehicle sales through dealerships" 
    },
    { 
      name: "Subscription Services", 
      share: "15%", 
      description: "Monthly subscription-based vehicle access" 
    },
    { 
      name: "Leasing Programs", 
      share: "18%", 
      description: "Long-term vehicle leasing arrangements" 
    },
    { 
      name: "Mobility as a Service", 
      share: "2%", 
      description: "Integrated transportation solutions" 
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Business Model Distribution - {selectedOEM} ({selectedCountry})
        </h3>
        <div className="space-y-4">
          {businessModels.map((model) => (
            <div key={model.name} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-white">{model.name}</h4>
                <span className="text-2xl font-bold text-blue-400">{model.share}</span>
              </div>
              <p className="text-gray-400 text-sm">{model.description}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                  style={{ width: model.share }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default BusinessModelAnalysis
