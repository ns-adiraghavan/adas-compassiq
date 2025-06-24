
import DataSnippets from "./snippets/DataSnippets"
import NewsSnippets from "./snippets/NewsSnippets"

interface AISnippetsSidebarProps {
  selectedOEM?: string
  selectedCountry?: string
  oemClickedFromChart?: boolean
  businessModelAnalysisContext?: any // New prop for business model analysis context
}

const AISnippetsSidebar = ({ 
  selectedOEM = "", 
  selectedCountry = "", 
  oemClickedFromChart = false,
  businessModelAnalysisContext
}: AISnippetsSidebarProps) => {
  return (
    <div className="h-full bg-gradient-to-b from-gray-800/30 to-gray-900/50 p-6 space-y-6 overflow-y-auto">
      <div className="space-y-6">
        <DataSnippets 
          selectedOEM={selectedOEM} 
          selectedCountry={selectedCountry}
          oemClickedFromChart={oemClickedFromChart}
          businessModelAnalysisContext={businessModelAnalysisContext}
        />
        <NewsSnippets />
      </div>
    </div>
  )
}

export default AISnippetsSidebar
