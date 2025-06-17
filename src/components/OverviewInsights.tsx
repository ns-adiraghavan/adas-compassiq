
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { useWaypointData } from "@/hooks/useWaypointData"
import { Card } from "@/components/ui/card"
import { FileText, Database, TrendingUp } from "lucide-react"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  const { data: waypointData, isLoading: waypointLoading } = useWaypointData()
  const { data: documents, isLoading: documentsLoading } = useStoredDocuments()

  if (waypointLoading || documentsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded"></div>
              <div className="h-8 bg-white/20 rounded"></div>
              <div className="h-3 bg-white/20 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const csvDataCount = waypointData?.csvData?.length || 0
  const totalDocuments = documents?.length || 0
  const totalCsvRows = waypointData?.csvData?.reduce((sum, file) => sum + (file.row_count || 0), 0) || 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CSV Data Overview */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-light text-blue-100">CSV Data</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-blue-50">{csvDataCount}</p>
            <p className="text-blue-200/80 text-sm">Data files loaded</p>
            <p className="text-blue-200/60 text-xs">{totalCsvRows.toLocaleString()} total records</p>
          </div>
        </Card>

        {/* Documents Overview */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-light text-green-100">Documents</h3>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-50">{totalDocuments}</p>
            <p className="text-green-200/80 text-sm">Files stored</p>
            <p className="text-green-200/60 text-xs">
              {documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0} bytes total
            </p>
          </div>
        </Card>

        {/* Current Selection */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/20 p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-light text-purple-100">Current View</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold text-purple-50">{selectedOEM || 'All OEMs'}</p>
            <p className="text-purple-200/80 text-sm">{selectedCountry || 'All Countries'}</p>
            <p className="text-purple-200/60 text-xs">Active filter selection</p>
          </div>
        </Card>
      </div>

      {/* Data Sources Summary */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-light text-white mb-4">Data Sources Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-3">CSV Analytics Data</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Comprehensive passenger car data with {totalCsvRows.toLocaleString()} records across {csvDataCount} files. 
              This includes OEM information, country distributions, feature analysis, and segment breakdowns.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white/90 mb-3">Document Library</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              {totalDocuments} documents stored directly in the database for analysis and reference. 
              Files include PDFs and PowerPoint presentations that can be retrieved and processed as needed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default OverviewInsights
