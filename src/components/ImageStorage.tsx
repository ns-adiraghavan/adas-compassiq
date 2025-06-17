
import { useEffect, useState } from "react"
import { storeImageInSupabase } from "@/utils/storeImageInSupabase"
import { useToast } from "@/hooks/use-toast"

const ImageStorage = () => {
  const [isStoring, setIsStoring] = useState(false)
  const [storedUrl, setStoredUrl] = useState<string | null>(null)
  const [gmStoredUrl, setGmStoredUrl] = useState<string | null>(null)
  const [nioStoredUrl, setNioStoredUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storeImages = async () => {
      setIsStoring(true)
      try {
        // Store Mahindra image
        const mahindraResult = await storeImageInSupabase(
          '/lovable-uploads/6a26cc1f-c14f-421c-bdb8-454a955c34b8.png',
          'Mahindra_scpe'
        )
        setStoredUrl(mahindraResult.url)

        // Store GM image
        const gmResult = await storeImageInSupabase(
          '/lovable-uploads/df315105-fcab-433b-9d86-5cfa1e36743d.png',
          'GM_cspe'
        )
        setGmStoredUrl(gmResult.url)

        // Store Nio image
        const nioResult = await storeImageInSupabase(
          '/lovable-uploads/2f8df56f-1d65-496b-a2bc-f8a75532725c.png',
          'Nio_cspe'
        )
        setNioStoredUrl(nioResult.url)
        
        toast({
          title: "Images stored successfully",
          description: "All three images (Mahindra_scpe, GM_cspe, and Nio_cspe) have been stored in Supabase database."
        })
      } catch (error) {
        console.error('Failed to store images:', error)
        toast({
          title: "Storage failed",
          description: "Failed to store the images. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsStoring(false)
      }
    }

    storeImages()
  }, [toast])

  return (
    <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 border-white/10 rounded-lg backdrop-blur-sm">
      <h3 className="text-xl font-light text-white mb-4">Image Storage Status</h3>
      
      {isStoring && (
        <div className="flex items-center space-x-2 text-white/60 mb-4">
          <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
          <span>Storing images in Supabase...</span>
        </div>
      )}

      <div className="space-y-6">
        {storedUrl && (
          <div className="space-y-4">
            <div className="text-green-400">
              ✓ Mahindra_scpe image successfully stored
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

        {gmStoredUrl && (
          <div className="space-y-4">
            <div className="text-green-400">
              ✓ GM_cspe image successfully stored
            </div>
            <div className="text-white/60 text-sm break-all">
              Storage URL: {gmStoredUrl}
            </div>
            <img 
              src={gmStoredUrl} 
              alt="GM CSPE" 
              className="max-w-full h-auto rounded-lg border border-white/10"
            />
          </div>
        )}

        {nioStoredUrl && (
          <div className="space-y-4">
            <div className="text-green-400">
              ✓ Nio_cspe image successfully stored
            </div>
            <div className="text-white/60 text-sm break-all">
              Storage URL: {nioStoredUrl}
            </div>
            <img 
              src={nioStoredUrl} 
              alt="Nio CSPE" 
              className="max-w-full h-auto rounded-lg border border-white/10"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageStorage
