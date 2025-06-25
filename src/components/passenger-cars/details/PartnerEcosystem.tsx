
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Users, ZoomIn } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useTheme } from "@/contexts/ThemeContext"

interface PartnerEcosystemProps {
  selectedOEM: string
  selectedCountry: string
}

const PartnerEcosystem = ({ selectedOEM, selectedCountry }: PartnerEcosystemProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { theme } = useTheme()

  // Mapping OEM names to their corresponding image files
  const getImageFileName = (oemName: string): string | null => {
    const normalizedOEM = oemName.toLowerCase().trim()
    
    const oemImageMap: { [key: string]: string } = {
      'zeekr': 'Zeekr_cspe.png',
      'hyundai': 'Hyundai_cspe.png',
      'nio': 'Nio_cspe.png',
      'gm': 'GM_cspe.png',
      'general motors': 'GM_cspe.png',
      'mahindra': 'Mahindra_scpe.png'
    }
    
    return oemImageMap[normalizedOEM] || null
  }

  useEffect(() => {
    const loadPartnerEcosystemImage = async () => {
      if (!selectedOEM) {
        setImageUrl(null)
        return
      }

      const imageFileName = getImageFileName(selectedOEM)
      
      if (!imageFileName) {
        setImageUrl(null)
        setHasError(false)
        return
      }

      setIsLoading(true)
      setHasError(false)

      try {
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl(`images/${imageFileName}`)
        
        if (data?.publicUrl) {
          setImageUrl(data.publicUrl)
        } else {
          setHasError(true)
        }
      } catch (error) {
        console.error('Error loading partner ecosystem image:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadPartnerEcosystemImage()
  }, [selectedOEM])

  return (
    <Card className={`h-full ${theme.cardBackground} ${theme.cardBorder} border`}>
      <CardHeader>
        <CardTitle className={`${theme.textPrimary} text-lg flex items-center`}>
          <Users className="h-5 w-5 mr-2" />
          Partner Ecosystem
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : imageUrl ? (
          <div className="flex flex-col items-center justify-center h-60">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                  <img
                    src={imageUrl}
                    alt={`${selectedOEM} Partner Ecosystem`}
                    className="w-full h-52 object-contain rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105"
                    onError={() => setHasError(true)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                <div className="flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={`${selectedOEM} Partner Ecosystem - Full View`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-medium">{selectedOEM} Partner Ecosystem</h3>
                  <p className="text-sm text-muted-foreground">Click outside to close</p>
                </div>
              </DialogContent>
            </Dialog>
            <p className={`text-sm ${theme.textMuted} mt-2 text-center`}>
              {selectedOEM} Partner Ecosystem
            </p>
          </div>
        ) : hasError ? (
          <div className="flex items-center justify-center h-60">
            <div className={`${theme.textMuted} text-center`}>
              <div className="text-lg font-medium mb-2">Image Not Available</div>
              <div className="text-sm">Partner ecosystem image for {selectedOEM} could not be loaded</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-60">
            <div className={`${theme.textMuted} text-center`}>
              <div className="text-lg font-medium mb-2">Coming Soon</div>
              <div className="text-sm">Partner ecosystem analysis for {selectedOEM}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PartnerEcosystem
