
import { useState, useEffect } from "react"
import { useStoredDocuments } from "@/hooks/useStoredDocuments"
import { Card } from "@/components/ui/card"

interface PartnerEcosystemProps {
  selectedOEM: string
}

const PartnerEcosystem = ({ selectedOEM }: PartnerEcosystemProps) => {
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white/60 font-light">Loading partner ecosystem...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-3xl font-light text-white">
          Partner Ecosystem
        </h2>
        <p className="text-white/60 font-light max-w-2xl mx-auto">
          Explore the comprehensive supply chain and partnership network for {selectedOEM}
        </p>
      </div>

      {/* Main Content */}
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="p-8">
          {currentImage ? (
            <div className="space-y-6">
              {/* OEM Title with Animation */}
              <div className="text-center space-y-2 animate-slide-in-right">
                <h3 className="text-2xl font-light text-white">
                  {selectedOEM} Supply Chain & Partnership Ecosystem
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full opacity-80"></div>
              </div>

              {/* Image Container with Advanced Animations */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`relative transform transition-all duration-700 ease-out ${
                  isImageLoaded 
                    ? 'scale-100 opacity-100 translate-y-0' 
                    : 'scale-95 opacity-0 translate-y-4'
                }`}>
                  <img
                    src={currentImage}
                    alt={`${selectedOEM} Partner Ecosystem`}
                    className="w-full max-w-5xl mx-auto rounded-lg border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                    onLoad={handleImageLoad}
                    loading="lazy"
                  />
                  
                  {/* Overlay Animation on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end">
                    <div className="p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-lg font-medium mb-2">Interactive Ecosystem Map</h4>
                      <p className="text-white/80 text-sm">Comprehensive view of {selectedOEM}'s global partnership network</p>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {!isImageLoaded && currentImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-white/60 text-sm">Loading ecosystem map...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics Cards with Staggered Animation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { label: "Strategic Partners", value: "150+", delay: "animation-delay-100" },
                  { label: "Global Suppliers", value: "500+", delay: "animation-delay-200" },
                  { label: "Technology Partners", value: "75+", delay: "animation-delay-300" }
                ].map((stat, index) => (
                  <Card key={stat.label} className={`bg-white/5 border-white/10 p-6 text-center hover-lift ${stat.delay}`}>
                    <div className="space-y-2">
                      <p className="text-2xl font-light text-white animate-scale-in">{stat.value}</p>
                      <p className="text-white/60 text-sm font-light">{stat.label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white/80">No Ecosystem Data Available</h3>
              <p className="text-white/60 font-light">
                Partner ecosystem visualization for {selectedOEM} is not yet available.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default PartnerEcosystem
