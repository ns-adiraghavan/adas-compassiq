
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { DollarSign, Target, TrendingUp } from "lucide-react"
import { useMemo } from "react"

interface BusinessModelIntelligenceProps {
  selectedOEM: string
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

const BusinessModelIntelligence = ({ selectedOEM }: BusinessModelIntelligenceProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const businessIntelligence = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM) return null

    const businessModels: Record<string, number> = {}
    const segments: Record<string, number> = {}
    const segmentBusinessModel: Record<string, Record<string, number>> = {}
    let totalFeatures = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.trim()
          
          if (rowOEM === selectedOEM) {
            totalFeatures++
            
            const businessModel = row['Business Model']?.trim() || 'Unknown'
            const segment = row.Segment?.trim() || 'Unknown'
            
            businessModels[businessModel] = (businessModels[businessModel] || 0) + 1
            segments[segment] = (segments[segment] || 0) + 1
            
            if (!segmentBusinessModel[segment]) {
              segmentBusinessModel[segment] = {}
            }
            segmentBusinessModel[segment][businessModel] = (segmentBusinessModel[segment][businessModel] || 0) + 1
          }
        })
      }
    })

    const businessModelData = Object.entries(businessModels)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: Math.round((count / totalFeatures) * 100)
      }))
      .sort((a, b) => b.value - a.value)

    const segmentData = Object.entries(segments)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: Math.round((count / totalFeatures) * 100)
      }))
      .sort((a, b) => b.value - a.value)

    const segmentBusinessData = Object.entries(segmentBusinessModel)
      .map(([segment, models]) => ({
        segment,
        ...models,
        total: Object.values(models).reduce((sum, count) => sum + count, 0)
      }))
      .sort((a, b) => b.total - a.total)

    return {
      businessModelData,
      segmentData,
      segmentBusinessData,
      totalFeatures,
      primaryBusinessModel: businessModelData[0]?.name || 'Unknown',
      primarySegment: segmentData[0]?.name || 'Unknown'
    }
  }, [waypointData, selectedOEM])

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-white/10 rounded"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!businessIntelligence) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <p className="text-white/60">No business model data available for {selectedOEM}</p>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6">
        <DollarSign className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-light text-white">{selectedOEM} Business Model Intelligence</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{businessIntelligence.primaryBusinessModel}</p>
          <p className="text-white/60 text-sm">Primary Revenue Model</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{businessIntelligence.primarySegment}</p>
          <p className="text-white/60 text-sm">Primary Segment</p>
        </div>
        
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{businessIntelligence.businessModelData.length}</p>
          <p className="text-white/60 text-sm">Revenue Models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Revenue Model Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessIntelligence.businessModelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {businessIntelligence.businessModelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-white mb-4">Segment Targeting</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessIntelligence.segmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
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
                <Bar dataKey="value" fill="#3B82F6" name="Features" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-medium text-white mb-4">Monetization Strategy by Segment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessIntelligence.segmentBusinessData.slice(0, 4).map((segment) => (
            <div key={segment.segment} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h5 className="text-white font-medium mb-2">{segment.segment}</h5>
              <div className="space-y-1 text-sm">
                {Object.entries(segment).filter(([key]) => key !== 'segment' && key !== 'total').map(([model, count]) => (
                  <div key={model} className="flex justify-between">
                    <span className="text-white/70">{model}:</span>
                    <span className="text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default BusinessModelIntelligence
