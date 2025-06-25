
import DataSnippets from "./snippets/DataSnippets"
import NewsSnippets from "./snippets/NewsSnippets"

interface AISnippetsSidebarProps {
  selectedOEM?: string
  selectedCountry?: string
  oemClickedFromChart?: boolean
  businessModelAnalysisContext?: any
  selectedOEMs?: string[]
  analysisType?: string
}

const AISnippetsSidebar = ({ 
  selectedOEM = "", 
  selectedCountry = "", 
  oemClickedFromChart = false,
  businessModelAnalysisContext,
  selectedOEMs = [],
  analysisType = "general"
}: AISnippetsSidebarProps) => {
  // Convert selectedOEM string to array format for NewsSnippets
  const oemsArray = selectedOEMs.length > 0 ? selectedOEMs : (selectedOEM ? [selectedOEM] : [])

  return (
    <div className="min-h-0 bg-gradient-to-b from-gray-800/30 to-gray-900/50 p-6 space-y-6">
      <div className="space-y-6">
        <DataSnippets 
          selectedOEM={selectedOEM} 
          selectedCountry={selectedCountry}
          oemClickedFromChart={oemClickedFromChart}
          businessModelAnalysisContext={businessModelAnalysisContext}
        />
        <NewsSnippets 
          selectedOEMs={oemsArray}
          selectedCountry={selectedCountry}
          analysisType={analysisType}
        />
      </div>
    </div>
  )
}

export default AISnippetsSidebar
