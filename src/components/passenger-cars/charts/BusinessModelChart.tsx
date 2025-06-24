
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"

interface BusinessModelChartProps {
  selectedCountry: string
  selectedOEMs: string[]
  onBusinessModelClick: (businessModel: string) => void
}

const BUSINESS_MODEL_COLORS = {
  'Free': '#10B981',
  'Subscription': '#3B82F6', 
  'Subscription - Free Trial': '#8B5CF6',
  'Freemium': '#F59E0B',
  'Flatrate': '#EF4444',
  'Free | Add - On': '#06B6D4',
  'Free | Flatrate': '#84CC16'
}

const BusinessModelChart = ({ selectedCountry, selectedOEMs, onBusinessModelClick }: BusinessModelChartProps) => {
  const { data: waypointData } = useWaypointData()
  const { theme } = useTheme()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return []
    }

    const businessModelData: Record<string, Record<string, number>> = {}
    const allBusinessModels = new Set<string>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const businessModel = row['Business Model']?.toString().trim() || 'Unknown'
            allBusinessModels.add(businessModel)
            
            if (!businessModelData[businessModel]) {
              businessModelData[businessModel] = {}
            }
            
            selectedOEMs.forEach(oem => {
              if (!businessModelData[businessModel][oem]) {
                businessModelData[businessModel][oem] = 0
              }
            })
            
            if (row.OEM === row.OEM) {
              businessModelData[businessModel][row.OEM] = (businessModelData[businessModel][row.OEM] || 0) + 1
            }
          }
        })
      }
    })

    return Array.from(allBusinessModels).map(businessModel => {
      const item: any = { name: businessModel }
      selectedOEMs.forEach(oem => {
        item[oem] = businessModelData[businessModel]?.[oem] || 0
      })
      item.total = selectedOEMs.reduce((sum, oem) => sum + (item[oem] || 0), 0)
      return item
    }).filter(item => item.total > 0).sort((a, b) => b.total - a.total)
  }, [waypointData, selectedCountry, selectedOEMs])

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      onBusinessModelClick(data.activeLabel)
    }
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className={`${theme.textMuted}`}>No data available for selected filters</p>
      </div>
    )
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} onClick={handleBarClick}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
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
          <Legend />
          {selectedOEMs.map((oem, index) => (
            <Bar 
              key={oem} 
              dataKey={oem} 
              stackId="a" 
              fill={Object.values(BUSINESS_MODEL_COLORS)[index % Object.values(BUSINESS_MODEL_COLORS).length]}
              name={oem}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BusinessModelChart
