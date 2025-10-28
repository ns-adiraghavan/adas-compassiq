
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

      // Generate signed URLs for each document
      const documentsWithUrls = await Promise.all(
        (data || []).map(async (doc) => {
          try {
            const { data: signedUrlData } = await supabase.storage
              .from('documents')
              .createSignedUrl(doc.storage_path, 3600); // 1 hour expiry
            
            return {
              ...doc,
              signedUrl: signedUrlData?.signedUrl || null
            };
          } catch (error) {
            console.error(`Error creating signed URL for ${doc.file_name}:`, error);
            return { ...doc, signedUrl: null };
          }
        })
      );

      console.log('Stored documents with signed URLs:', documentsWithUrls)
      return documentsWithUrls
    },
  })
}
