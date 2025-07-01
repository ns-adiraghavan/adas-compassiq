
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

const PassengerCarsCarousel = () => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const imageFiles = ['pcl_1.jpg', 'pcl_2.jpg', 'pcl_3.jpg', 'pcl_4.jpg', 'pcl_5.jpg', 'pcl_6.jpg', 'pcl_7.jpg', 'pcl_8.jpg']

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

  // Hexagonal shape for Passenger Cars
  const containerStyle = {
    clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
    width: "100%",
    height: "400px",
    transform: "rotate(0deg)"
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
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
      
      <div className="absolute top-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  )
}

export default PassengerCarsCarousel
