import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DuplicateFile {
  id: string
  file_name: string
  file_size: number
  uploaded_at: string
  storage_path: string
}

export function useDuplicateDetection() {
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  const checkForDuplicates = async (fileName: string, fileSize: number): Promise<DuplicateFile[]> => {
    setIsChecking(true)
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, file_size, uploaded_at, storage_path')
        .eq('file_name', fileName)
        .eq('file_size', fileSize)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error checking for duplicates:', error)
      toast({
        title: "Error checking duplicates",
        description: "Failed to check for duplicate files",
        variant: "destructive"
      })
      return []
    } finally {
      setIsChecking(false)
    }
  }

  const removeDuplicate = async (duplicateId: string, storagePath: string) => {
    try {
      // Remove from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', duplicateId)

      if (dbError) throw dbError

      // Remove from storage if storage path exists
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([storagePath])

        if (storageError) {
          console.error('Error removing from storage:', storageError)
        }
      }

      toast({
        title: "Duplicate removed",
        description: "The duplicate file has been removed successfully"
      })
    } catch (error) {
      console.error('Error removing duplicate:', error)
      toast({
        title: "Error removing duplicate",
        description: "Failed to remove the duplicate file",
        variant: "destructive"
      })
    }
  }

  const cleanupAllDuplicates = async () => {
    try {
      // Find all files with duplicates (same name and size)
      const { data: allFiles, error } = await supabase
        .from('documents')
        .select('id, file_name, file_size, uploaded_at, storage_path')
        .order('uploaded_at', { ascending: false })

      if (error) throw error

      const duplicateGroups = new Map<string, DuplicateFile[]>()
      
      // Group files by name and size
      allFiles?.forEach(file => {
        const key = `${file.file_name}-${file.file_size}`
        if (!duplicateGroups.has(key)) {
          duplicateGroups.set(key, [])
        }
        duplicateGroups.get(key)!.push(file)
      })

      let removedCount = 0
      
      // For each group with duplicates, keep the most recent and remove others
      for (const [key, files] of duplicateGroups) {
        if (files.length > 1) {
          // Sort by uploaded_at descending, keep first (most recent)
          const sortedFiles = files.sort((a, b) => 
            new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
          )
          
          // Remove all but the first (most recent)
          for (let i = 1; i < sortedFiles.length; i++) {
            await removeDuplicate(sortedFiles[i].id, sortedFiles[i].storage_path || '')
            removedCount++
          }
        }
      }

      toast({
        title: "Cleanup completed",
        description: `Removed ${removedCount} duplicate files`
      })

      return removedCount
    } catch (error) {
      console.error('Error during cleanup:', error)
      toast({
        title: "Cleanup failed",
        description: "Failed to clean up duplicate files",
        variant: "destructive"
      })
      return 0
    }
  }

  return {
    checkForDuplicates,
    removeDuplicate,
    cleanupAllDuplicates,
    isChecking
  }
}
