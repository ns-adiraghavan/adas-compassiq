
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
    <div className="h-full p-6 w-full max-w-full overflow-hidden">
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full flex flex-col w-full max-w-full overflow-hidden`}>
        <CardHeader className="pb-3 flex-shrink-0 w-full max-w-full overflow-hidden">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center w-full max-w-full overflow-hidden`}>
            <Newspaper className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="truncate">AI Snippets</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 w-full max-w-full overflow-hidden p-6">
          <div className="space-y-6 h-full overflow-y-auto w-full max-w-full pr-2">
            {/* News Section */}
            <div className="space-y-3 w-full max-w-full overflow-hidden">
              <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
                <Newspaper className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">News Updates</span>
              </h3>
              <ul className="space-y-2 w-full max-w-full overflow-hidden">
                {mockNews.map((news) => (
                  <li key={news.id} className={`${theme.textPrimary} text-sm w-full max-w-full overflow-hidden`}>
                    <div className="w-full max-w-full overflow-hidden">
                      <span className="font-medium break-words">{news.title}:</span>{" "}
                      <span className={`${theme.textSecondary} break-words`}>{news.summary}</span>{" "}
                      <span className={`${theme.textMuted} text-xs break-words`}>({news.timestamp})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Section */}
            <div className="space-y-3 w-full max-w-full overflow-hidden">
              <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
                <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Data Insights</span>
              </h3>
              <ul className="space-y-2 w-full max-w-full overflow-hidden">
                {mockData.map((data) => (
                  <li key={data.id} className={`${theme.textPrimary} text-sm w-full max-w-full overflow-hidden`}>
                    <div className="w-full max-w-full overflow-hidden">
                      <span className="font-medium break-words">{data.metric}:</span>{" "}
                      <span className={`${theme.secondary} font-bold break-words`}>{data.value}</span>{" "}
                      <span className={`${theme.accent} font-medium break-words`}>({data.trend})</span>{" "}
                      <span className={`${theme.textSecondary} break-words`}>- {data.context}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AISnippetsSidebar
