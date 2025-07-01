
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

const CommercialVehiclesCarousel = () => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const imageFiles = ['cvl_1.jpg', 'cvl_2.jpg', 'cvl_3.jpg', 'cvl_4.jpg']

  useEffect(() => {
    const loadImages = async () => {
      console.log('Loading Commercial Vehicles carousel images...')
      try {
        const imageUrls = await Promise.all(
          imageFiles.map(async (fileName) => {
            const { data } = supabase.storage
              .from('documents')
              .getPublicUrl(`uploads/${fileName}`)
            
            console.log(`Image URL for ${fileName}:`, data?.publicUrl)
            
            if (data?.publicUrl) {
              try {
                const response = await fetch(data.publicUrl, { method: 'HEAD' })
                if (response.ok) {
                  return data.publicUrl
                } else {
                  console.warn(`Image ${fileName} not accessible:`, response.status)
                  return null
                }
              } catch (fetchError) {
                console.warn(`Error fetching ${fileName}:`, fetchError)
                return null
              }
            }
            return null
          })
        )
        
        const validUrls = imageUrls.filter(url => url !== null) as string[]
        console.log('Valid Commercial Vehicles image URLs:', validUrls)
        
        if (validUrls.length === 0) {
          setHasError(true)
        } else {
          setImages(validUrls)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading Commercial Vehicles carousel images:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [images.length])

  const containerStyle = {
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    transform: "rotate(2deg)",
    width: "100%",
    height: "400px"
  }

  if (isLoading) {
    return (
      <div 
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105"
        style={containerStyle}
      >
        <div className="w-full h-full bg-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-gray-600">Loading images...</div>
        </div>
      </div>
    )
  }

  if (hasError || images.length === 0) {
    return (
      <div 
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-orange-600/30 to-red-600/30 flex items-center justify-center"
        style={containerStyle}
      >
        <div className="text-white/60 text-center">
          <div className="text-lg font-medium mb-2">Commercial Vehicles</div>
          <div className="text-sm">Fleet Intelligence Platform</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative overflow-hidden transition-all duration-500 group-hover:scale-105"
      style={containerStyle}
    >
      {images.map((imageUrl, index) => (
        <img
          key={`${imageUrl}-${index}`}
          src={imageUrl}
          alt={`Commercial Vehicle ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommercialVehiclesCarousel
