
import { Card } from "@/components/ui/card"
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { useMemo } from "react"
import { FileText, Download, Calendar, HardDrive } from "lucide-react"

interface DocumentDashboardProps {
  documentAnalysis?: any
}

const DocumentDashboard = ({ documentAnalysis }: DocumentDashboardProps) => {
  const { data: documents, isLoading } = useStoredDocuments()

  const dashboardStats = useMemo(() => {
    if (!documents?.length) {
      return {
        totalFiles: 0,
        totalSize: 0,
        fileTypes: {},
        latestUpload: null
      }
    }

    const stats = {
      totalFiles: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
      fileTypes: {},
      latestUpload: documents[0]?.uploaded_at
    }

    // Count file types
    documents.forEach(doc => {
      const type = doc.file_type
      if (type.includes('pdf')) {
        stats.fileTypes['PDF'] = (stats.fileTypes['PDF'] || 0) + 1
      } else if (type.includes('presentation') || type.includes('pptx')) {
        stats.fileTypes['PowerPoint'] = (stats.fileTypes['PowerPoint'] || 0) + 1
      } else {
        stats.fileTypes['Other'] = (stats.fileTypes['Other'] || 0) + 1
      }
    })

    return stats
  }, [documents])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="text-white/60 font-light mt-4">Loading documents...</p>
      </Card>
    )
  }

  if (!documents?.length) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-8 text-center backdrop-blur-sm">
        <FileText className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <h3 className="text-xl font-light text-white mb-2">No Documents Stored</h3>
        <p className="text-white/60 font-light">
          Upload PDF or PowerPoint documents to get started with your document library.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-blue-100">{dashboardStats.totalFiles}</p>
              <p className="text-blue-200/60 text-sm">Total Documents</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <HardDrive className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-100">{formatFileSize(dashboardStats.totalSize)}</p>
              <p className="text-green-200/60 text-sm">Total Storage</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Download className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-purple-100">{Object.keys(dashboardStats.fileTypes).length}</p>
              <p className="text-purple-200/60 text-sm">File Types</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-orange-400" />
            <div>
              <p className="text-lg font-bold text-orange-100">
                {dashboardStats.latestUpload ? formatDate(dashboardStats.latestUpload).split(',')[0] : 'N/A'}
              </p>
              <p className="text-orange-200/60 text-sm">Latest Upload</p>
            </div>
          </div>
        </Card>
      </div>

      {/* File Type Distribution */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h4 className="text-lg font-light text-white mb-4">File Type Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(dashboardStats.fileTypes).map(([type, count]) => (
            <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-medium">{type}</p>
              <p className="text-white/60 text-sm">{count} file{count !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Document List */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h4 className="text-lg font-light text-white mb-4">Document Library</h4>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                {doc.file_type.includes('pdf') ? (
                  <FileText className="h-5 w-5 text-red-500" />
                ) : (
                  <Presentation className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <p className="text-white font-medium">{doc.file_name}</p>
                  <p className="text-white/60 text-sm">
                    {formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="text-white/40 text-sm">
                ID: {doc.id.slice(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default DocumentDashboard
