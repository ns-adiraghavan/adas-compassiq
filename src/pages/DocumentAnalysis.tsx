
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import WaypointLogo from "@/components/WaypointLogo"
import FileUpload from "@/components/FileUpload"
import DocumentDashboard from "@/components/DocumentDashboard"

const DocumentAnalysis = () => {
  const [documentAnalysis, setDocumentAnalysis] = useState<any>(null)

  const handleFileAnalyzed = (analysis: any) => {
    setDocumentAnalysis(analysis)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <WaypointLogo />
        </div>
        <h1 className="text-2xl font-bold">Document Intelligence</h1>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-thin tracking-tight text-white">
            AI-Powered Document Analysis
          </h2>
          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            Upload PDF or PowerPoint documents to generate intelligent dashboards that correlate with your passenger car data
          </p>
        </div>

        <FileUpload onFileAnalyzed={handleFileAnalyzed} />
        
        <DocumentDashboard documentAnalysis={documentAnalysis} />
      </main>
    </div>
  )
}

export default DocumentAnalysis
