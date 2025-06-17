import { Card } from "@/components/ui/card"
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { useMemo } from "react"
import { FileText, Download, Calendar, HardDrive, Presentation, Image, Video, Music, FileSpreadsheet, File } from "lucide-react"

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
        fileTypes: {} as Record<string, number>,
        latestUpload: null
      }
    }

    const stats = {
      totalFiles: documents.length,
      totalSize: documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
      fileTypes: {} as Record<string, number>,
      latestUpload: documents[0]?.uploaded_at
    }

    // Count file types with better categorization
    documents.forEach(doc => {
      const type = doc.file_type
      const name = doc.file_name.toLowerCase()
      
      if (type.includes('pdf')) {
        stats.fileTypes['PDF'] = (stats.fileTypes['PDF'] || 0) + 1
      } else if (type.includes('presentation') || name.includes('.pptx') || name.includes('.ppt')) {
        stats.fileTypes['PowerPoint'] = (stats.fileTypes['PowerPoint'] || 0) + 1
      } else if (type.includes('wordprocessing') || name.includes('.docx') || name.includes('.doc')) {
        stats.fileTypes['Word Documents'] = (stats.fileTypes['Word Documents'] || 0) + 1
      } else if (type.includes('spreadsheet') || name.includes('.xlsx') || name.includes('.xls') || name.includes('.csv')) {
        stats.fileTypes['Spreadsheets'] = (stats.fileTypes['Spreadsheets'] || 0) + 1
      } else if (type.includes('image')) {
        stats.fileTypes['Images'] = (stats.fileTypes['Images'] || 0) + 1
      } else if (type.includes('video')) {
        stats.fileTypes['Videos'] = (stats.fileTypes['Videos'] || 0) + 1
      } else if (type.includes('audio')) {
        stats.fileTypes['Audio'] = (stats.fileTypes['Audio'] || 0) + 1
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

  const getFileIcon = (type: string, name: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes('presentation') || name.toLowerCase().includes('.pptx') || name.toLowerCase().includes('.ppt')) 
      return <Presentation className="h-5 w-5 text-orange-500" />
    if (type.includes('wordprocessing') || name.toLowerCase().includes('.docx') || name.toLowerCase().includes('.doc')) 
      return <FileText className="h-5 w-5 text-blue-500" />
    if (type.includes('spreadsheet') || name.toLowerCase().includes('.xlsx') || name.toLowerCase().includes('.xls') || name.toLowerCase().includes('.csv')) 
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    if (type.includes('image')) return <Image className="h-5 w-5 text-blue-500" />
    if (type.includes('video')) return <Video className="h-5 w-5 text-purple-500" />
    if (type.includes('audio')) return <Music className="h-5 w-5 text-pink-500" />
    return <File className="h-5 w-5 text-gray-500" />
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
        <h3 className="text-xl font-light text-white mb-2">No Files Stored</h3>
        <p className="text-white/60 font-light">
          Upload documents, images, media files, spreadsheets, and data files to get started with your file library.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* File Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-blue-100">{dashboardStats.totalFiles}</p>
              <p className="text-blue-200/60 text-sm">Total Files</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <HardDrive className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-100">{formatFileSize(dashboardStats.totalSize)}</p>
              <p className="text-green-200/60 text-sm">Storage Used</p>
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

      {/* File Library */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <h4 className="text-lg font-light text-white mb-4">File Library (Stored in Supabase Storage)</h4>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                {getFileIcon(doc.file_type, doc.file_name)}
                <div>
                  <p className="text-white font-medium">{doc.file_name}</p>
                  <p className="text-white/60 text-sm">
                    {formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}
                  </p>
                  {doc.storage_path && (
                    <p className="text-white/40 text-xs">Storage: {doc.storage_path}</p>
                  )}
                </div>
              </div>
              <div className="text-green-400 text-sm flex items-center space-x-2">
                <HardDrive className="h-4 w-4" />
                <span>✓ In Storage</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default DocumentDashboard
