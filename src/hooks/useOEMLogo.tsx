
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useOEMLogo(oemName: string) {
  return useQuery({
    queryKey: ['oem-logo', oemName],
    queryFn: async () => {
      if (!oemName) return null
      
      console.log('Fetching logo for OEM:', oemName)
      
      // Try to find the logo in the documents table
      const { data, error } = await supabase
        .from('documents')
        .select('file_name, storage_path, file_path')
        .ilike('file_name', `%${oemName}%`)
        .like('file_type', 'image%')
        .limit(1)
        .single()
      
      if (error) {
        console.log('No logo found for OEM:', oemName, error)
        return null
      }

      // If we have a storage path, use it to get the public URL
      if (data?.storage_path) {
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(data.storage_path)
        
        return urlData?.publicUrl || null
      }

      // Fallback to file_path if available
      return data?.file_path || null
    },
    enabled: !!oemName,
  })
}
