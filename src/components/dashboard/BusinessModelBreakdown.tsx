
import { Card } from "@/components/ui/card"

interface BusinessModelBreakdownProps {
  businessModelData: Array<{ name: string; value: number; color: string }>
  totalFeatures: number
}

const BusinessModelBreakdown = ({ businessModelData, totalFeatures }: BusinessModelBreakdownProps) => {
  if (businessModelData.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-light text-white mb-6">Business Model Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessModelData.map((model) => (
          <div key={model.name} className="text-center">
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-6 border border-white/10">
              <h4 className="text-white font-medium mb-2">{model.name}</h4>
              <p className="text-3xl font-bold text-white mb-1" style={{ color: model.color }}>
                {model.value}
              </p>
              <p className="text-white/60 text-sm">
                {Math.round((model.value / totalFeatures) * 100)}% of features
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default BusinessModelBreakdown
