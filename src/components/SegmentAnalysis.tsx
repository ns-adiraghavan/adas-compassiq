
import { Card } from "@/components/ui/card"

interface SegmentAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

const SegmentAnalysis = ({ selectedOEM, selectedCountry }: SegmentAnalysisProps) => {
  const segments = [
    { name: "Economy", volume: "2.5M", price: "$15-25K", growth: "+3%" },
    { name: "Mid-range", volume: "1.8M", price: "$25-40K", growth: "+7%" },
    { name: "Premium", volume: "0.8M", price: "$40-70K", growth: "+12%" },
    { name: "Luxury", volume: "0.3M", price: "$70K+", growth: "+18%" }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Market Segment Analysis - {selectedOEM} ({selectedCountry})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {segments.map((segment) => (
            <div key={segment.name} className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">{segment.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white font-semibold">{segment.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price Range:</span>
                  <span className="text-white font-semibold">{segment.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Growth:</span>
                  <span className="text-green-400 font-semibold">{segment.growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default SegmentAnalysis
