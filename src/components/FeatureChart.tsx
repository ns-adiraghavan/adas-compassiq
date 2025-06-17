
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
    color: "hsl(var(--primary))",
  },
}

export function FeatureChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Count by OEM</CardTitle>
        <CardDescription>Total available features across different manufacturers</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              <XAxis dataKey="oem" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="features" fill="var(--color-features)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
