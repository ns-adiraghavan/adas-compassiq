
import { useState, useEffect } from "react"
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { Card } from "@/components/ui/card"

interface SidebarPartnerEcosystemProps {
  selectedOEM: string
}

const SidebarPartnerEcosystem = ({ selectedOEM }: SidebarPartnerEcosystemProps) => {
  const { data: documents, isLoading } = useStoredDocuments()
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Map OEM names to their corresponding image file names
  const oemImageMap: { [key: string]: string } = {
    'Mahindra': 'Mahindra_scpe.png',
    'GM': 'GM_cspe.png', 
    'NIO': 'Nio_cspe.png',
    'Hyundai': 'Hyundai_cspe.png',
    'Zeekr': 'Zeekr_cspe.png'
  }

  // Find the image for the selected OEM
  useEffect(() => {
    if (documents && selectedOEM) {
      const targetFileName = oemImageMap[selectedOEM]
      if (targetFileName) {
        const document = documents.find(doc => doc.file_name === targetFileName)
        if (document && document.storage_path) {
          // Construct the Supabase storage URL
          const imageUrl = `https://agtnxvmnpkwjkihupqxj.supabase.co/storage/v1/object/public/documents/${document.storage_path}`
          setCurrentImage(imageUrl)
          setIsImageLoaded(false)
        }
      }
    }
  }, [selectedOEM, documents])

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  if (isLoading) {
    return (
      <div className="p-3">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-sm font-medium text-sidebar-foreground/80">
        Partner Ecosystem
      </h3>
      
      {currentImage ? (
        <Card className="bg-sidebar-accent/50 border-sidebar-border p-2 overflow-hidden">
          <div className="space-y-2">
            <div className="text-xs text-sidebar-foreground/60 text-center">
              {selectedOEM}
            </div>
            
            <div className="relative group">
              <div className={`transform transition-all duration-500 ease-out ${
                isImageLoaded 
                  ? 'scale-100 opacity-100' 
                  : 'scale-95 opacity-0'
              }`}>
                <img
                  src={currentImage}
                  alt={`${selectedOEM} Ecosystem`}
                  className="w-full rounded border border-sidebar-border/50 hover:scale-105 transition-transform duration-300"
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
              </div>
              
              {!isImageLoaded && currentImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-sidebar-accent/30 rounded">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-sidebar-accent/20 border-sidebar-border/50 p-3 text-center">
          <div className="text-xs text-sidebar-foreground/40">
            No ecosystem data for {selectedOEM}
          </div>
        </Card>
      )}
    </div>
  )
}

export default SidebarPartnerEcosystem
