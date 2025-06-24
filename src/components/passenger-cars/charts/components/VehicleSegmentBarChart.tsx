
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useTheme } from "@/contexts/ThemeContext"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentBarChartProps {
  chartData: any[]
  availableSegments: string[]
  selectedOEMs: string[]
  groupingMode: GroupingMode
}

const VehicleSegmentBarChart = ({ 
  chartData, 
  availableSegments, 
  selectedOEMs, 
  groupingMode 
}: VehicleSegmentBarChartProps) => {
  const { theme } = useTheme()

  const segmentColors: Record<string, string> = {
    'Entry': '#ef4444',
    'Mid': '#f97316', 
    'Premium': '#eab308',
    'Luxury': '#10b981'
  }

  const oemColors: string[] = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

  const dataKeys = groupingMode === 'by-oem' ? availableSegments : selectedOEMs

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fill: theme.textSecondary.includes('text-gray-400') ? '#9ca3af' : '#6b7280' }}
          axisLine={{ stroke: theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fill: theme.textSecondary.includes('text-gray-400') ? '#9ca3af' : '#6b7280' }}
          axisLine={{ stroke: theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: theme.cardBackground.includes('bg-gray-800') ? '#1f2937' : '#ffffff',
            border: `1px solid ${theme.cardBorder.includes('border-gray-700') ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: theme.textPrimary.includes('text-white') ? '#ffffff' : '#000000',
          }}
          formatter={(value: any, name: string) => [
            `${Number(value)} features`,
            name
          ]}
        />
        <Legend />
        {dataKeys.map((key, index) => {
          let barColor: string
          if (groupingMode === 'by-oem') {
            barColor = segmentColors[key] || '#8b5cf6'
          } else {
            barColor = oemColors[index % oemColors.length] || '#8b5cf6'
          }
          
          return (
            <Bar
              key={key}
              dataKey={key}
              fill={barColor}
              name={key}
            />
          )
        })}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default VehicleSegmentBarChart
