
import NewsSnippets from "./snippets/NewsSnippets"
import DataSnippets from "./snippets/DataSnippets"

const AISnippetsSidebar = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* News Snippets */}
      <div className="flex-1">
        <NewsSnippets />
      </div>

      {/* Data Snippets */}
      <div className="flex-1">
        <DataSnippets />
      </div>
    </div>
  )
}

export default AISnippetsSidebar
