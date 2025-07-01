
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useOEMLogo(oemName: string) {
  return useQuery({
    queryKey: ['oem-logo', oemName],
    queryFn: async () => {
      if (!oemName) return null
      
      console.log('Fetching logo for OEM:', oemName)
      
      // Try to find the logo in the documents table using the specific naming pattern
      const logoFileName = `${oemName}_logo`
      console.log('Looking for logo file:', logoFileName)
      
      const { data, error } = await supabase
        .from('documents')
        .select('file_name, storage_path, file_path')
        .ilike('file_name', `${logoFileName}%`)
        .like('file_type', 'image%')
        .limit(1)
        .maybeSingle()
      
      if (error) {
        console.log('Error fetching logo for OEM:', oemName, error)
        return null
      }

      if (!data) {
        console.log('No logo found for OEM:', oemName)
        return null
      }

      console.log('Found logo data:', data)

      // If we have a storage path, use it to get the public URL
      if (data?.storage_path) {
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(data.storage_path)
        
        console.log('Generated public URL:', urlData?.publicUrl)
        return urlData?.publicUrl || null
      }

      // Fallback to file_path if available
      console.log('Using file_path:', data?.file_path)
      return data?.file_path || null
    },
    enabled: !!oemName,
  })
}
