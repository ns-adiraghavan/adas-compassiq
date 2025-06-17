
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

const chartConfig = {
  features: {
    label: "Features",
    color: "hsl(217.2 91.2% 59.8%)",
  },
}

export function FeatureChart() {
  const { data: waypointData, isLoading } = useWaypointData()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    console.log('Processing chart data...')
    
    const oemFeatureCounts = new Map()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM) {
            const currentCount = oemFeatureCounts.get(row.OEM) || 0
            oemFeatureCounts.set(row.OEM, currentCount + 1)
          }
        })
      }
    })

    const result = Array.from(oemFeatureCounts.entries())
      .map(([oem, features]) => ({ oem, features }))
      .sort((a, b) => b.features - a.features)
      .slice(0, 8) // Top 8 OEMs

    console.log('Chart data processed:', result)
    return result
  }, [waypointData])

  if (isLoading) {
    return (
      <Card className="hover-lift animate-fade-in bg-gradient-to-br from-card/50 to-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Feature Count by OEM</CardTitle>
          <CardDescription className="text-muted-foreground">Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover-lift animate-fade-in bg-gradient-to-br from-card/50 to-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground">Feature Count by OEM</CardTitle>
        <CardDescription className="text-muted-foreground">
          {chartData.length > 0 ? 'Real-time data from WayPoint database' : 'No data available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="oem" 
                  tick={{ fill: 'hsl(215 20.2% 65.1%)' }}
                  axisLine={{ stroke: 'hsl(217.2 32.6% 17.5%)' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(215 20.2% 65.1%)' }}
                  axisLine={{ stroke: 'hsl(217.2 32.6% 17.5%)' }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  contentStyle={{
                    backgroundColor: 'hsl(217.2 32.6% 17.5%)',
                    border: '1px solid hsl(217.2 32.6% 17.5%)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="features" 
                  fill="hsl(217.2 91.2% 59.8%)" 
                  radius={[4, 4, 0, 0]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No data available. Upload CSV files to see charts.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
