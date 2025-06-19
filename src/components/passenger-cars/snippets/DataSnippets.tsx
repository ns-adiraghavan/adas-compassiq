
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"

const DataSnippets = () => {
  const mockData = [
    {
      id: 1,
      metric: "ADAS Adoption Rate",
      value: "73%",
      trend: "+5.2%",
      context: "YoY growth in premium segment"
    },
    {
      id: 2,
      metric: "EV Feature Integration",
      value: "89%",
      trend: "+12.1%",
      context: "New model launches"
    },
    {
      id: 3,
      metric: "OTA Update Frequency",
      value: "2.3x",
      trend: "+15%",
      context: "Monthly average per OEM"
    },
    {
      id: 4,
      metric: "Connected Services",
      value: "91%",
      trend: "+8.7%",
      context: "Market penetration rate"
    }
  ]

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Data Snippets - From AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockData.map((data) => (
          <div key={data.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-white text-sm font-medium">{data.metric}</h4>
              <span className="text-blue-400 text-sm font-bold">{data.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">{data.context}</p>
              <span className="text-green-400 text-xs font-medium">{data.trend}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default DataSnippets
