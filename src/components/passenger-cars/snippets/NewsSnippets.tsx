
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { useNewsSnippetsAI } from "@/hooks/useNewsSnippetsAI"
import { useState } from "react"

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

  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())

  const newsSnippets = newsData?.newsSnippets || []

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

      // Check if URL is accessible (basic check)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      try {
        // Try to fetch just the headers to check if URL is accessible
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors' // Allow cross-origin requests
        })
        clearTimeout(timeoutId)
        
        // Open the URL
        window.open(url, '_blank', 'noopener,noreferrer')
        
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.warn('URL accessibility check failed, but opening anyway:', url)
        // Still try to open the URL as the fetch might fail due to CORS but URL might be valid
        window.open(url, '_blank', 'noopener,noreferrer')
      }

    } catch (error) {
      console.error('Invalid URL:', url, error)
      setFailedUrls(prev => new Set(prev).add(url))
      
      // Show user-friendly error message
      if (url.includes('example.com')) {
        alert('This is demo content. Real news links will be available with live data.')
      } else {
        alert('This news link appears to be invalid. Please try another article.')
      }
    }
  }

  const isRealContent = newsSnippets.some(news => !news.url.includes('example.com'))

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          News Snippets - Real Time
          {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          {!isRealContent && !isLoading && (
            <div className="relative">
              <AlertCircle className="h-4 w-4 ml-2 text-yellow-500" />
              <span className="sr-only">Demo content - real URLs will show with live data</span>
            </div>
          )}
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
          <div className="text-gray-400 text-sm space-y-1">
            <p>Unable to load live news updates</p>
            <p className="text-xs text-gray-500">Showing automotive industry highlights instead</p>
          </div>
        ) : (
          <div className="space-y-2">
            {!isRealContent && (
              <div className="text-xs text-yellow-400 mb-2 p-2 bg-yellow-900/20 rounded border border-yellow-700/30">
                Note: Currently showing demo content. Live news will appear with API access.
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
