
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
        <ul className="space-y-2 list-disc list-inside pl-2">
          {mockData.map((data) => (
            <li key={data.id} className="text-white text-sm break-words">
              <span className="font-medium">{data.metric}:</span>{" "}
              <span className="text-blue-400 font-bold">{data.value}</span>{" "}
              <span className="text-green-400 font-medium">({data.trend})</span>{" "}
              <span className="text-gray-400">- {data.context}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default DataSnippets
