
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

const WaypointLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl('uploads/white_logo.png')
        
        if (data?.publicUrl) {
          setLogoUrl(data.publicUrl)
        }
      } catch (error) {
        console.error('Error loading logo:', error)
      }
    }

    loadLogo()
  }, [])

  return (
    <div className="flex items-center">
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt="WayPoint Logo" 
          className="h-12 w-auto"
        />
      ) : (
        <div className="h-12 w-12 bg-gray-300 animate-pulse rounded"></div>
      )}
    </div>
  )
}

export default WaypointLogo
