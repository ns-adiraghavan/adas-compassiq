
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

const PassengerCarsCarousel = () => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const imageFiles = ['pcl_1.png', 'pcl_2.png', 'pcl_3.png', 'pcl_4.png', 'pcl_5.png', 'pcl_6.png', 'pcl_7.png', 'pcl_8.png']

  useEffect(() => {
    const loadImages = async () => {
      console.log('Loading carousel images...')
      try {
        const imageUrls = await Promise.all(
          imageFiles.map(async (fileName) => {
            const { data } = supabase.storage
              .from('documents')
              .getPublicUrl(`uploads/${fileName}`)
            
            console.log(`Image URL for ${fileName}:`, data?.publicUrl)
            
            // Test if the image actually loads
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
        console.log('Valid image URLs:', validUrls)
        
        if (validUrls.length === 0) {
          setHasError(true)
        } else {
          setImages(validUrls)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading carousel images:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  useEffect(() => {
    if (images.length <= 1) return

    console.log('Starting carousel with', images.length, 'images')
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length
        console.log('Carousel changing from', prevIndex, 'to', nextIndex)
        return nextIndex
      })
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
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center"
        style={containerStyle}
      >
        <div className="text-white/60 text-center">
          <div className="text-lg font-medium mb-2">Passenger Cars</div>
          <div className="text-sm">Premium Automotive Intelligence</div>
          <div className="text-xs mt-2 opacity-50">Images loading...</div>
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
          alt={`Passenger Car ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
          onError={(e) => {
            console.error(`Image ${index + 1} failed to load:`, imageUrl)
            e.currentTarget.style.display = 'none'
          }}
        />
      ))}
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Carousel indicators - only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                console.log('Manual navigation to image', index)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Debug info - remove in production */}
      <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  )
}

export default PassengerCarsCarousel
