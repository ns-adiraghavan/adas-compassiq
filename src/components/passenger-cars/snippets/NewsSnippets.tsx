
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Loader2, ExternalLink } from "lucide-react"
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

  const handleNewsClick = (url: string) => {
    // Validate URL before opening
    try {
      const validUrl = new URL(url)
      if (validUrl.protocol === 'http:' || validUrl.protocol === 'https:') {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        console.warn('Invalid URL protocol:', url)
      }
    } catch (error) {
      console.error('Invalid URL:', url, error)
      // Only show alert for obviously invalid URLs
      if (!url.startsWith('http')) {
        alert('Invalid news URL. Please try again.')
      }
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          News Snippets - Real Time
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
          <div className="space-y-2">
            {newsSnippets.map((news) => (
              <div 
                key={news.id} 
                className="cursor-pointer hover:bg-gray-800/50 p-3 rounded-lg transition-colors group border border-transparent hover:border-gray-600"
                onClick={() => handleNewsClick(news.url)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">
                        {news.title}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-2 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-gray-400 text-xs mb-2 leading-relaxed">
                      {news.summary}
                    </p>
                    <div className="text-gray-500 text-xs">
                      <span className="italic">{news.source}</span> • <span>{news.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NewsSnippets
