
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"

interface CompetitivePositioningProps {
  selectedOEM: string
}

const CompetitivePositioning = ({ selectedOEM }: CompetitivePositioningProps) => {
  const { dashboardMetrics, isLoading } = useDashboardMetrics(selectedOEM, "")

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </Card>
    )
  }

  // Prepare competitive data with colors
  const competitiveData = dashboardMetrics.oemPerformance.map(oem => ({
    ...oem,
    fill: oem.name.includes(selectedOEM) ? "#10B981" : "#3B82F6"
  }))

  const insights = [
    {
      title: "Market Position",
      value: dashboardMetrics.oemPerformance.findIndex(oem => 
        oem.name.includes(selectedOEM)
      ) + 1,
      suffix: ` of ${dashboardMetrics.oemPerformance.length}`,
      description: "Ranking by total features"
    },
    {
      title: "Feature Gap",
      value: dashboardMetrics.oemPerformance[0]?.features - 
             (dashboardMetrics.oemPerformance.find(oem => 
               oem.name.includes(selectedOEM)
             )?.features || 0),
      suffix: " features",
      description: "Behind market leader"
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-6">Competitive Positioning</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {insight.value}{insight.suffix}
              </div>
              <div className="text-sm text-white/60 mt-1">{insight.title}</div>
              <div className="text-xs text-white/40 mt-1">{insight.description}</div>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="features" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default CompetitivePositioning
