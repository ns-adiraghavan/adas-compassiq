import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

const AgricultureVehiclesCarousel = () => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const imageFiles = ['agri_1.jpg', 'agri_2.jpg', 'agri_3.jpg', 'agri_4.jpg']

  useEffect(() => {
    const loadImages = async () => {
      console.log('Loading Agriculture Vehicles carousel images...')
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
        console.log('Valid Agriculture Vehicles image URLs:', validUrls)
        
        if (validUrls.length === 0) {
          setHasError(true)
        } else {
          setImages(validUrls)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading Agriculture Vehicles carousel images:', error)
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

  // Rectangular shape with full width and 400px height
  const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "16px"
  }

  if (isLoading) {
    return (
      <div 
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105 mx-auto rounded-2xl"
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
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-yellow-600/30 to-orange-600/30 flex items-center justify-center mx-auto rounded-2xl"
        style={containerStyle}
      >
        <div className="text-white/60 text-center">
          <div className="text-lg font-medium mb-2">Agriculture Vehicles</div>
          <div className="text-sm">Smart Farming Technology</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative overflow-hidden transition-all duration-500 group-hover:scale-105 mx-auto rounded-2xl"
      style={containerStyle}
    >
      {images.map((imageUrl, index) => (
        <img
          key={`${imageUrl}-${index}`}
          src={imageUrl}
          alt={`Agriculture Vehicle ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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

export default AgricultureVehiclesCarousel
