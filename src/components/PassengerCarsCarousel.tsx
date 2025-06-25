
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

const PassengerCarsCarousel = () => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const imageFiles = ['pcl_1.png', 'pcl_2.png', 'pcl_3.png', 'pcl_4.png', 'pcl_5.png', 'pcl_6.png', 'pcl_7.png', 'pcl_8.png']

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageUrls = await Promise.all(
          imageFiles.map(async (fileName) => {
            const { data } = supabase.storage
              .from('documents')
              .getPublicUrl(`uploads/${fileName}`)
            return data?.publicUrl || null
          })
        )
        
        const validUrls = imageUrls.filter(url => url !== null) as string[]
        setImages(validUrls)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading carousel images:', error)
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3500) // Change image every 3.5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  if (isLoading) {
    return (
      <div 
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105"
        style={{
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          transform: "rotate(2deg)",
          width: "100%",
          height: "400px"
        }}
      >
        <div className="w-full h-full bg-gray-300 animate-pulse"></div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div 
        className="relative overflow-hidden transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center"
        style={{
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          transform: "rotate(2deg)",
          width: "100%",
          height: "400px"
        }}
      >
        <div className="text-white/60 text-center">
          <div className="text-lg font-medium mb-2">Passenger Cars</div>
          <div className="text-sm">Premium Automotive Intelligence</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative overflow-hidden transition-all duration-500 group-hover:scale-105"
      style={{
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        transform: "rotate(2deg)",
        width: "100%",
        height: "400px"
      }}
    >
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Passenger Car ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Carousel indicators */}
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
    </div>
  )
}

export default PassengerCarsCarousel
