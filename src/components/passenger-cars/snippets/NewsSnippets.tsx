
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"

const NewsSnippets = () => {
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
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          News Snippets - From AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2 list-disc list-inside pl-2">
          {mockNews.map((news) => (
            <li key={news.id} className="text-white text-sm break-words">
              <span className="font-medium">{news.title}:</span>{" "}
              <span className="text-gray-400">{news.summary}</span>{" "}
              <span className="text-gray-500 text-xs">({news.timestamp})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default NewsSnippets
