
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
          alt="CompassIQ Logo" 
          className="h-12 w-auto"
        />
      ) : (
        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          CompassIQ
        </div>
      )}
    </div>
  )
}

export default WaypointLogo
