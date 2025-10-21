import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import teslaLogo from "@/assets/oem-logos/tesla_logo.png"
import rivianLogo from "@/assets/oem-logos/rivian_logo.png"
import bmwLogo from "@/assets/oem-logos/bmw_logo.png"
import gmLogo from "@/assets/oem-logos/gm_logo.png"
import fordLogo from "@/assets/oem-logos/ford_logo.png"

// Local logo mapping for common OEMs
const LOCAL_LOGOS: Record<string, string> = {
  'tesla': teslaLogo,
  'rivian': rivianLogo,
  'bmw': bmwLogo,
  'gm': gmLogo,
  'general motors': gmLogo,
  'ford': fordLogo,
}

export function useOEMLogo(oemName: string) {
  return useQuery({
    queryKey: ['oem-logo', oemName],
    queryFn: async () => {
      if (!oemName) return null
      
      // First, check local logos
      const normalizedName = oemName.toLowerCase().trim()
      if (LOCAL_LOGOS[normalizedName]) {
        return LOCAL_LOGOS[normalizedName]
      }
      
      console.log('Fetching logo for OEM from database:', oemName)
      
      // Fallback: Try to find the logo in the documents table
      const logoFileName = `${oemName}_logo`
      
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
