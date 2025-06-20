
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
    <div 
      className="h-full p-6"
      style={{ 
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <Card 
        className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full flex flex-col`}
        style={{ 
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <CardHeader className="pb-3 flex-shrink-0" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          <CardTitle className={`${theme.textPrimary} text-lg flex items-center`} style={{ width: '100%', maxWidth: '100%' }}>
            <Newspaper className="h-5 w-5 mr-2 flex-shrink-0" />
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 2rem)'
            }}>
              AI Snippets
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent 
          className="flex-1" 
          style={{ 
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <div 
            className="space-y-6 h-full overflow-y-auto"
            style={{ 
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              paddingRight: '0.5rem'
            }}
          >
            {/* News Section */}
            <div 
              className="space-y-3" 
              style={{ 
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
                <Newspaper className="h-4 w-4 mr-2 flex-shrink-0" />
                <span style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  News Updates
                </span>
              </h3>
              <ul 
                className="space-y-2 list-disc list-inside pl-2"
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {mockNews.map((news) => (
                  <li 
                    key={news.id} 
                    className={`${theme.textPrimary} text-sm`}
                    style={{ 
                      width: '100%',
                      maxWidth: '100%',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      hyphens: 'auto',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}
                  >
                    <span 
                      className="font-medium"
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {news.title}:
                    </span>{" "}
                    <span 
                      className={`${theme.textSecondary}`}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {news.summary}
                    </span>{" "}
                    <span 
                      className={`${theme.textMuted} text-xs`}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      ({news.timestamp})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Section */}
            <div 
              className="space-y-3" 
              style={{ 
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              <h3 className={`${theme.textPrimary} text-sm font-medium flex items-center`}>
                <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                <span style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  Data Insights
                </span>
              </h3>
              <ul 
                className="space-y-2 list-disc list-inside pl-2"
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {mockData.map((data) => (
                  <li 
                    key={data.id} 
                    className={`${theme.textPrimary} text-sm`}
                    style={{ 
                      width: '100%',
                      maxWidth: '100%',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      hyphens: 'auto',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}
                  >
                    <span 
                      className="font-medium"
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {data.metric}:
                    </span>{" "}
                    <span 
                      className={`${theme.secondary} font-bold`}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      {data.value}
                    </span>{" "}
                    <span 
                      className={`${theme.accent} font-medium`}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      ({data.trend})
                    </span>{" "}
                    <span 
                      className={`${theme.textSecondary}`}
                      style={{ 
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      - {data.context}
                    </span>
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
