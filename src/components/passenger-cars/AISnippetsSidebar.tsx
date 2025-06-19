
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, BarChart } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

const AISnippetsSidebar = () => {
  const { theme } = useTheme()

  const mockNews = [
    {
      id: 1,
      title: "Tesla's FSD Beta Expansion",
      summary: "Tesla expands Full Self-Driving beta to more markets",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "BMW's Electric Strategy",
      summary: "BMW announces new electric vehicle platform",
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      title: "Waymo Partnership",
      summary: "Waymo partners with automotive suppliers",
      timestamp: "6 hours ago"
    },
    {
      id: 4,
      title: "Ford's Software Updates",
      summary: "Ford releases major over-the-air updates",
      timestamp: "8 hours ago"
    }
  ]

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
    <div className="h-full">
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center`}>
            <Newspaper className="h-5 w-5 mr-2" />
            AI Snippets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* News Section */}
          <div className="space-y-3">
            <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
              <Newspaper className="h-4 w-4 mr-2" />
              News Updates
            </h3>
            {mockNews.map((news) => (
              <div key={news.id} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border backdrop-blur-sm`}>
                <h4 className={`${theme.textPrimary} text-sm font-medium mb-1`}>{news.title}</h4>
                <p className={`${theme.textSecondary} text-xs mb-2`}>{news.summary}</p>
                <div className={`${theme.textMuted} text-xs`}>{news.timestamp}</div>
              </div>
            ))}
          </div>

          {/* Data Section */}
          <div className="space-y-3">
            <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
              <BarChart className="h-4 w-4 mr-2" />
              Data Insights
            </h3>
            {mockData.map((data) => (
              <div key={data.id} className={`p-3 ${theme.cardBackground} rounded-lg ${theme.cardBorder} border backdrop-blur-sm`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`${theme.textPrimary} text-sm font-medium`}>{data.metric}</h4>
                  <span className={`${theme.secondary} text-sm font-bold`}>{data.value}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`${theme.textSecondary} text-xs`}>{data.context}</p>
                  <span className={`${theme.accent} text-xs font-medium`}>{data.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AISnippetsSidebar
