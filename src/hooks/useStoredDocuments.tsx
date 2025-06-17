
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useStoredDocuments() {
  return useQuery({
    queryKey: ['stored-documents'],
    queryFn: async () => {
      console.log('Fetching stored documents...')
      
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, file_type, file_size, uploaded_at, metadata, file_path, storage_path')
        .order('uploaded_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching documents:', error)
        throw error
      }

      console.log('Stored documents:', data)
      return data || []
    },
  })
}
