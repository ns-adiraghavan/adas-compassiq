
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
    <div className="h-full w-full">
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full flex flex-col`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center`}>
            <Newspaper className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>AI Snippets</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-4">
          <div className="space-y-4 h-full flex flex-col">
            {/* News Section */}
            <div className="flex-1">
              <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center mb-3`}>
                <Newspaper className="h-4 w-4 mr-2 flex-shrink-0" />
                News Updates
              </h3>
              <div className="space-y-2">
                {mockNews.slice(0, 3).map((news) => (
                  <div key={news.id} className={`${theme.textPrimary} text-xs p-2 ${theme.cardBackground} rounded-lg border ${theme.cardBorder}`}>
                    <div className="font-medium mb-1 text-sm">{news.title}</div>
                    <div className={`${theme.textSecondary} text-xs mb-1`}>{news.summary}</div>
                    <div className={`${theme.textMuted} text-xs`}>{news.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Section */}
            <div className="flex-1">
              <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center mb-3`}>
                <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                Data Insights
              </h3>
              <div className="space-y-2">
                {mockData.slice(0, 3).map((data) => (
                  <div key={data.id} className={`${theme.textPrimary} text-xs p-2 ${theme.cardBackground} rounded-lg border ${theme.cardBorder}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{data.metric}</span>
                      <span className={`${theme.secondary} font-bold text-sm`}>{data.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${theme.textSecondary} text-xs`}>{data.context}</span>
                      <span className={`${theme.accent} font-medium text-xs`}>{data.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AISnippetsSidebar
