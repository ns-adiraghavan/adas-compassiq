
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, Loader2, ExternalLink, AlertCircle, CheckCircle, Search, ToggleLeft, ToggleRight } from "lucide-react"
import { useNewsSnippetsAI } from "@/hooks/useNewsSnippetsAI"
import { useState, useEffect } from "react"

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
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState<boolean>(() => {
    // Get initial state from localStorage, default to true
    const saved = localStorage.getItem('news-snippets-auto-generate')
    return saved ? JSON.parse(saved) : true
  })
  
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())

  // Save preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('news-snippets-auto-generate', JSON.stringify(autoGenerateEnabled))
  }, [autoGenerateEnabled])

  const { data: newsData, isLoading, error } = useNewsSnippetsAI({
    selectedOEMs,
    selectedCountry,
    analysisType,
    enabled: Boolean(selectedCountry && analysisType && autoGenerateEnabled)
  })

  const newsSnippets = newsData?.newsSnippets || []
  const isRealWebSearch = newsData?.context?.source === 'real_web_search'
  const isFallbackContent = newsData?.context?.source?.includes('fallback')

  const handleToggleAutoGenerate = () => {
    setAutoGenerateEnabled(prev => !prev)
  }

  const handleNewsClick = async (url: string, title: string) => {
    // Check if this URL has already failed
    if (failedUrls.has(url)) {
      alert('This news link is currently unavailable. Please try again later.')
      return
    }

    // Validate URL format
    try {
      const validUrl = new URL(url)
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        console.warn('Invalid URL protocol:', url)
        alert('Invalid news URL format.')
        return
      }

      // Open the URL directly
      window.open(url, '_blank', 'noopener,noreferrer')
      
    } catch (error) {
      console.error('Invalid URL:', url, error)
      setFailedUrls(prev => new Set(prev).add(url))
      alert('This news link appears to be invalid. Please try another article.')
    }
  }

  const getContentStatusIcon = () => {
    if (isRealWebSearch) {
      return <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
    } else if (isFallbackContent) {
      return <AlertCircle className="h-4 w-4 ml-2 text-yellow-500" />
    }
    return <Search className="h-4 w-4 ml-2 text-blue-500" />
  }

  const getContentStatusText = () => {
    if (isRealWebSearch) {
      return "Live web search results with validated sources"
    } else if (isFallbackContent) {
      return "Curated automotive news highlights"
    }
    return "Contextual automotive news analysis"
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
            <Newspaper className="h-5 w-5 mr-2" />
            News Snippets - Real Time
            {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
            {!isLoading && getContentStatusIcon()}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAutoGenerate}
            className="h-8 px-2 text-gray-400 hover:text-white"
            title={autoGenerateEnabled ? "Disable auto-generation" : "Enable auto-generation"}
          >
            {autoGenerateEnabled ? (
              <ToggleRight className="h-4 w-4 text-green-400" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-500" />
            )}
            <span className="ml-1 text-xs">
              {autoGenerateEnabled ? "ON" : "OFF"}
            </span>
          </Button>
        </div>
        {!isLoading && (
          <p className="text-xs text-gray-400 mt-1">
            {autoGenerateEnabled ? getContentStatusText() : "Auto-generation disabled to save API usage"}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {!autoGenerateEnabled ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm space-y-2">
              <ToggleLeft className="h-8 w-8 mx-auto text-gray-500 mb-3" />
              <p className="font-medium">Auto-generation is disabled</p>
              <p className="text-xs text-gray-500">Enable the toggle above to fetch real-time news updates</p>
              <p className="text-xs text-gray-500">This helps reduce API usage when not needed</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-gray-400 text-sm space-y-1">
            <p>Unable to load live news updates</p>
            <p className="text-xs text-gray-500">Showing automotive industry highlights instead</p>
          </div>
        ) : (
          <div className="space-y-2">
            {isRealWebSearch && (
              <div className="text-xs text-green-400 mb-2 p-2 bg-green-900/20 rounded border border-green-700/30">
                ✓ Real-time web search results with validated article links
              </div>
            )}
            {isFallbackContent && (
              <div className="text-xs text-yellow-400 mb-2 p-2 bg-yellow-900/20 rounded border border-yellow-700/30">
                Note: Showing curated content. Links direct to automotive news sections.
              </div>
            )}
            {newsSnippets.map((news) => (
              <div 
                key={news.id} 
                className="cursor-pointer hover:bg-gray-800/50 p-3 rounded-lg transition-colors group border border-transparent hover:border-gray-600"
                onClick={() => handleNewsClick(news.url, news.title)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">
                        {news.title}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-2 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      {failedUrls.has(news.url) && (
                        <div className="relative">
                          <AlertCircle className="h-3 w-3 ml-1 text-red-400" />
                          <span className="sr-only">Link unavailable</span>
                        </div>
                      )}
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
