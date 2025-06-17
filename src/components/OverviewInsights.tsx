
import { Card } from "@/components/ui/card"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Market Share</h3>
          <p className="text-3xl font-bold text-blue-400">23.4%</p>
          <p className="text-gray-400 text-sm mt-1">+2.1% vs last quarter</p>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-green-400">1.2M</p>
          <p className="text-gray-400 text-sm mt-1">Units sold this year</p>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Growth Rate</h3>
          <p className="text-3xl font-bold text-purple-400">+15.2%</p>
          <p className="text-gray-400 text-sm mt-1">Year over year</p>
        </Card>
      </div>
      
      <Card className="bg-gray-900 border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Overview for {selectedOEM} in {selectedCountry}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          This section provides comprehensive insights into passenger car market dynamics, 
          sales performance, and competitive positioning. The data reflects current market 
          trends and strategic positioning of automotive manufacturers across different regions.
        </p>
      </Card>
    </div>
  )
}

export default OverviewInsights
