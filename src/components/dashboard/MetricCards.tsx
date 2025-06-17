
import { Card } from "@/components/ui/card"
import { Database, Building, Globe, DollarSign, Star } from "lucide-react"

interface MetricCardsProps {
  metrics: {
    totalFeatures: number
    totalOEMs: number
    totalCountries: number
    lighthouseFeatures: number
    subscriptionFeatures: number
    freeFeatures: number
  }
}

const MetricCards = ({ metrics }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-light text-blue-100">Total Features</h3>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-blue-50">{metrics.totalFeatures.toLocaleString()}</p>
          <p className="text-blue-200/80 text-sm">Connected services tracked</p>
          <div className="flex items-center space-x-2 mt-3">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-blue-200/60 text-xs">{metrics.lighthouseFeatures} lighthouse features</span>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-6 w-6 text-green-400" />
          <h3 className="text-lg font-light text-green-100">OEM Partners</h3>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-green-50">{metrics.totalOEMs}</p>
          <p className="text-green-200/80 text-sm">Global manufacturers</p>
          <p className="text-green-200/60 text-xs">
            Avg {Math.round(metrics.totalFeatures / (metrics.totalOEMs || 1))} features per OEM
          </p>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="h-6 w-6 text-purple-400" />
          <h3 className="text-lg font-light text-purple-100">Global Reach</h3>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-purple-50">{metrics.totalCountries}</p>
          <p className="text-purple-200/80 text-sm">Countries covered</p>
          <p className="text-purple-200/60 text-xs">
            {Math.round(metrics.totalFeatures / (metrics.totalCountries || 1))} avg features/country
          </p>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/20 p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="h-6 w-6 text-orange-400" />
          <h3 className="text-lg font-light text-orange-100">Revenue Model</h3>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-orange-50">
            {Math.round((metrics.subscriptionFeatures / (metrics.totalFeatures || 1)) * 100)}%
          </p>
          <p className="text-orange-200/80 text-sm">Subscription-based</p>
          <p className="text-orange-200/60 text-xs">
            {metrics.freeFeatures} free features
          </p>
        </div>
      </Card>
    </div>
  )
}

export default MetricCards
