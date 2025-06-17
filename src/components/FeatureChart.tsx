
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const sampleData = [
  { oem: "BMW", features: 68 },
  { oem: "Mercedes", features: 72 },
  { oem: "Audi", features: 65 },
  { oem: "Tesla", features: 58 },
  { oem: "Toyota", features: 45 },
  { oem: "Honda", features: 42 },
  { oem: "Ford", features: 38 },
  { oem: "Volvo", features: 55 },
]

const chartConfig = {
  features: {
    label: "Features",
    color: "hsl(217.2 91.2% 59.8%)",
  },
}

export function FeatureChart() {
  return (
    <Card className="hover-lift animate-fade-in bg-gradient-to-br from-card/50 to-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground">Feature Count by OEM</CardTitle>
        <CardDescription className="text-muted-foreground">Total available features across different manufacturers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
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
      </CardContent>
    </Card>
  )
}
