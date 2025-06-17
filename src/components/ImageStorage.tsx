
import { useEffect, useState } from "react"
import { storeImageInSupabase } from "@/utils/storeImageInSupabase"
import { useToast } from "@/hooks/use-toast"

const ImageStorage = () => {
  const [isStoring, setIsStoring] = useState(false)
  const [storedUrl, setStoredUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storeImage = async () => {
      setIsStoring(true)
      try {
        const result = await storeImageInSupabase(
          '/lovable-uploads/6a26cc1f-c14f-421c-bdb8-454a955c34b8.png',
          'Mahindra_scpe'
        )
        
        setStoredUrl(result.url)
        toast({
          title: "Image stored successfully",
          description: "Mahindra_scpe image has been stored in Supabase database."
        })
      } catch (error) {
        console.error('Failed to store image:', error)
        toast({
          title: "Storage failed",
          description: "Failed to store the image. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsStoring(false)
      }
    }

    storeImage()
  }, [toast])

  return (
    <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 border-white/10 rounded-lg backdrop-blur-sm">
      <h3 className="text-xl font-light text-white mb-4">Image Storage Status</h3>
      
      {isStoring && (
        <div className="flex items-center space-x-2 text-white/60">
          <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
          <span>Storing Mahindra_scpe image in Supabase...</span>
        </div>
      )}

      {storedUrl && (
        <div className="space-y-4">
          <div className="text-green-400">
            ✓ Image successfully stored as "Mahindra_scpe"
          </div>
          <div className="text-white/60 text-sm break-all">
            Storage URL: {storedUrl}
          </div>
          <img 
            src={storedUrl} 
            alt="Mahindra SCPE" 
            className="max-w-full h-auto rounded-lg border border-white/10"
          />
        </div>
      )}
    </div>
  )
}

export default ImageStorage
