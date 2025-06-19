
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface DuplicateFile {
  id: string
  file_name: string
  file_size: number
  uploaded_at: string
  storage_path: string
}

interface DuplicateDialogProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  duplicates: DuplicateFile[]
  onReplace: () => void
  onKeepBoth: () => void
  onCancel: () => void
}

export function DuplicateDialog({ 
  isOpen, 
  onClose, 
  fileName, 
  duplicates, 
  onReplace, 
  onKeepBoth, 
  onCancel 
}: DuplicateDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Duplicate File Detected
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                A file named <strong>"{fileName}"</strong> already exists.
              </p>
              
              {duplicates.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Existing file:</p>
                  {duplicates.map((duplicate) => (
                    <div key={duplicate.id} className="text-sm text-gray-600">
                      <div>Size: {formatFileSize(duplicate.file_size)}</div>
                      <div>Uploaded: {formatDate(duplicate.uploaded_at)}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-sm">
                What would you like to do?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-col sm:space-x-0">
          <Button 
            onClick={onReplace}
            variant="destructive"
            className="w-full"
          >
            Replace existing file
          </Button>
          <Button 
            onClick={onKeepBoth}
            variant="outline"
            className="w-full"
          >
            Keep both files
          </Button>
          <AlertDialogCancel onClick={onCancel} className="w-full">
            Cancel upload
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
