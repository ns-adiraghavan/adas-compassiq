
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import DataSnippets from "./snippets/DataSnippets"

interface AISnippetsSidebarProps {
  selectedOEM?: string
  selectedCountry?: string
}

const AISnippetsSidebar = ({ selectedOEM = "", selectedCountry = "" }: AISnippetsSidebarProps) => {
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

  return (
    <div className="h-full flex flex-col">
      <Card className={`${theme.cardBackground} ${theme.cardBorder} border backdrop-blur-sm flex-1 flex flex-col`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center`}>
            <Newspaper className="h-5 w-5 mr-2" />
            AI Snippets
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-6">
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

            {/* AI Data Insights Section */}
            <DataSnippets selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AISnippetsSidebar
