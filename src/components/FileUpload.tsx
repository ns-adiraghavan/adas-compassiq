import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, Presentation, Loader2, Image, Video, Music, FileSpreadsheet, File, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useDuplicateDetection } from "@/hooks/useDuplicateDetection"
import { DuplicateDialog } from "@/components/DuplicateDialog"

interface FileUploadProps {
  onFileAnalyzed: (analysis: any) => void
}

interface PendingUpload {
  file: File
  duplicates: Array<{
    id: string
    file_name: string
    file_size: number
    uploaded_at: string
    storage_path: string
  }>
}

const FileUpload = ({ onFileAnalyzed }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; type: string; size: number }>>([])
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const { toast } = useToast()
  const { checkForDuplicates, cleanupAllDuplicates, isChecking } = useDuplicateDetection()

  const supportedTypes = [
    // Documents
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'application/vnd.ms-powerpoint', // ppt
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/msword', // doc
    // Spreadsheets
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'text/csv',
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Media
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    // Text files
    'text/plain',
    'application/json',
    'application/xml'
  ]

  const isValidFileType = (file: File) => {
    return supportedTypes.includes(file.type) || 
           file.name.toLowerCase().endsWith('.csv') ||
           file.name.toLowerCase().endsWith('.txt') ||
           file.name.toLowerCase().endsWith('.json')
  }

  const uploadFile = async (file: File, replaceDuplicate?: boolean) => {
    try {
      // If replacing, remove the duplicate first
      if (replaceDuplicate && pendingUpload?.duplicates) {
        for (const duplicate of pendingUpload.duplicates) {
          const { error: deleteDbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', duplicate.id)

          if (deleteDbError) throw deleteDbError

          // Remove from storage
          if (duplicate.storage_path) {
            const { error: storageError } = await supabase.storage
              .from('documents')
              .remove([duplicate.storage_path])
            
            if (storageError) {
              console.error('Error removing from storage:', storageError)
            }
          }
        }
      }

      // Generate unique filename to prevent overwrites
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const filePath = `uploads/${timestamp}_${randomStr}_${file.name}`

      // Upload file to Supabase Storage with unique filename
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Store file metadata in database with original filename
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert({
          file_name: file.name, // Use original filename
          file_type: file.type || 'application/octet-stream',
          file_size: file.size,
          file_path: uploadData.path,
          storage_path: uploadData.path,
          metadata: {
            upload_timestamp: new Date().toISOString(),
            original_name: file.name,
            storage_bucket: 'documents'
          }
        })
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([uploadData.path])
        throw dbError
      }

      const newFile = {
        id: dbData.id,
        name: file.name, // Display original name
        type: file.type || 'application/octet-stream',
        size: file.size
      }

      setUploadedFiles(prev => [...prev, newFile])
      onFileAnalyzed({ file: newFile, stored: true, storagePath: uploadData.path })

      const action = replaceDuplicate ? 'replaced' : 'uploaded'
      toast({
        title: `File ${action} successfully`,
        description: `${file.name} has been stored with its original filename.`
      })

    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: "destructive"
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      if (!isValidFileType(file)) {
        toast({
          title: "Invalid file type",
          description: `File type ${file.type || 'unknown'} is not supported. Please upload supported document, image, media, or data files.`,
          variant: "destructive"
        })
        continue
      }

      // Check for duplicates
      const duplicates = await checkForDuplicates(file.name, file.size)
      
      if (duplicates.length > 0) {
        // Show duplicate dialog
        setPendingUpload({ file, duplicates })
        setShowDuplicateDialog(true)
        setIsUploading(false)
        // Reset input
        event.target.value = ''
        return // Process one file at a time when duplicates are found
      } else {
        // No duplicates, upload directly
        await uploadFile(file)
      }
    }

    setIsUploading(false)
    // Reset input
    event.target.value = ''
  }

  const handleDuplicateReplace = async () => {
    if (pendingUpload) {
      setShowDuplicateDialog(false)
      setIsUploading(true)
      await uploadFile(pendingUpload.file, true)
      setPendingUpload(null)
      setIsUploading(false)
    }
  }

  const handleDuplicateKeepBoth = async () => {
    if (pendingUpload) {
      setShowDuplicateDialog(false)
      setIsUploading(true)
      await uploadFile(pendingUpload.file, false)
      setPendingUpload(null)
      setIsUploading(false)
    }
  }

  const handleDuplicateCancel = () => {
    setShowDuplicateDialog(false)
    setPendingUpload(null)
  }

  const handleCleanupDuplicates = async () => {
    const removedCount = await cleanupAllDuplicates()
    if (removedCount > 0) {
      // Refresh uploaded files list
      window.location.reload()
    }
  }

  const getFileIcon = (type: string, name: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes('presentation') || name.toLowerCase().includes('.pptx') || name.toLowerCase().includes('.ppt')) 
      return <Presentation className="h-5 w-5 text-orange-500" />
    if (type.includes('spreadsheet') || name.toLowerCase().includes('.xlsx') || name.toLowerCase().includes('.xls') || name.toLowerCase().includes('.csv')) 
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    if (type.includes('image')) return <Image className="h-5 w-5 text-blue-500" />
    if (type.includes('video')) return <Video className="h-5 w-5 text-purple-500" />
    if (type.includes('audio')) return <Music className="h-5 w-5 text-pink-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-light text-white">Upload Files</h3>
            <Button
              onClick={handleCleanupDuplicates}
              disabled={isChecking}
              variant="outline"
              size="sm"
              className="bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isChecking ? 'Cleaning...' : 'Remove Duplicates'}
            </Button>
          </div>
          
          <p className="text-white/60 font-light">
            Upload documents, images, media files, spreadsheets, and data files to store them in Supabase Storage for analysis and dashboard generation.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button 
                disabled={isUploading || isChecking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </>
                  )}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.csv,.txt,.json,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.avi,.mov,.wmv,.webm,.mp3,.wav,.ogg,.m4a"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading || isChecking}
            />
            <div className="text-white/40 text-sm space-y-1">
              <p>Supports: PDF, PPTX, DOCX, XLSX, CSV, Images (JPG, PNG, GIF, WebP, SVG)</p>
              <p>Media: MP4, AVI, MOV, MP3, WAV, and more</p>
            </div>
          </div>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h4 className="text-lg font-light text-white mb-4">Uploaded Files</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                {getFileIcon(file.type, file.name)}
                <div className="flex-1">
                  <span className="text-white font-medium block">{file.name}</span>
                  <span className="text-white/60 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <span className="text-green-400 text-sm">✓ Stored in Storage</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <DuplicateDialog
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        fileName={pendingUpload?.file.name || ''}
        duplicates={pendingUpload?.duplicates || []}
        onReplace={handleDuplicateReplace}
        onKeepBoth={handleDuplicateKeepBoth}
        onCancel={handleDuplicateCancel}
      />
    </div>
  )
}

export default FileUpload
