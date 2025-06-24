
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Loader2 } from "lucide-react"
import { useNewsSnippetsAI } from "@/hooks/useNewsSnippetsAI"

interface NewsSnippetsProps {
  selectedOEMs?: string[]
  selectedCountry?: string
  analysisType?: string
}

const NewsSnippets = ({ 
  selectedOEMs = [], 
  selectedCountry = "", 
  analysisType = "general" 
}: NewsSnippetsProps) => {
  const { data: newsData, isLoading, error } = useNewsSnippetsAI({
    selectedOEMs,
    selectedCountry,
    analysisType,
    enabled: Boolean(selectedCountry && analysisType)
  })

  const newsSnippets = newsData?.newsSnippets || []

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          News Snippets - From AI
          {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-gray-400 text-sm">Unable to load news updates</p>
        ) : (
          <ul className="space-y-2 list-disc list-inside pl-2">
            {newsSnippets.map((news) => (
              <li key={news.id} className="text-white text-sm break-words">
                <span className="font-medium">{news.title}:</span>{" "}
                <span className="text-gray-400">{news.summary}</span>{" "}
                <div className="text-gray-500 text-xs mt-1">
                  <span className="italic">{news.source}</span> • <span>{news.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default NewsSnippets
