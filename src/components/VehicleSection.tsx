
import { Car, Upload } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

interface VehicleCategory {
  title: string
  subtitle: string
  description: string
  image: string
  icon: any
  href: string
  color: string
}

interface VehicleSectionProps {
  category?: VehicleCategory
  index?: number
  currentSection?: number
  sectionIndex?: number
}

const VehicleSection = ({ category, index, currentSection, sectionIndex }: VehicleSectionProps) => {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Check if section is in viewport
        const isInView = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2
        setIsVisible(isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate animation values based on scroll position
  const getImageTransform = () => {
    if (!sectionRef.current) return {}
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Calculate progress (0 to 1) as element enters viewport
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.8)))
    
    // Scale from 0.8 to 1.05 with easing
    const scale = 0.8 + (progress * 0.25)
    
    // Opacity from 0 to 1
    const opacity = progress
    
    // Slight parallax movement
    const translateY = (1 - progress) * 50
    
    return {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      opacity,
      transition: 'none' // Smooth scroll, no CSS transitions
    }
  }

  // Calculate text slide animation
  const getTextTransform = (isEven: boolean) => {
    if (!sectionRef.current) return {}
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Calculate progress (0 to 1) as element enters viewport
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.9)))
    
    // Slide in from left or right based on layout
    const translateX = isEven 
      ? (1 - progress) * 80  // Slide from right when image is on left
      : (1 - progress) * -80 // Slide from left when image is on right
    
    // Opacity and slight vertical movement
    const opacity = Math.max(0.3, progress)
    const translateY = (1 - progress) * 20
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px)`,
      opacity,
      transition: 'none'
    }
  }

  // If category prop is provided, render single category
  if (category) {
    const Icon = category.icon
    const isEven = index !== undefined && index % 2 === 0
    
    return (
      <section 
        ref={sectionRef}
        className="py-20 px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to={category.href} className="group block">
            <div className={`flex items-center gap-12 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
              
              {/* Large Curved Image with Scroll Animation */}
              <div 
                className="relative overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-700 ease-out"
                style={{
                  borderRadius: isEven 
                    ? "65% 35% 25% 75% / 55% 25% 75% 45%" 
                    : "35% 65% 75% 25% / 45% 75% 25% 55%",
                  transform: `rotate(${isEven ? '3deg' : '-3deg'})`,
                  width: "450px",
                  height: "350px",
                  ...getImageTransform()
                }}
              >
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Content with side sliding animation */}
              <div 
                className="flex-1 relative z-10"
                style={getTextTransform(isEven)}
              >
                <div className="flex items-center mb-8">
                  <div className="p-4 bg-white/20 rounded-3xl mr-6 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-light text-white mb-2">{category.title}</h3>
                    <p className="text-xl text-white/70 font-light">{category.subtitle}</p>
                  </div>
                </div>
                <p className="text-white/60 font-light leading-relaxed mb-8 text-lg max-w-2xl">
                  {category.description}
                </p>
                <div className="flex items-center text-white/80 font-medium group-hover:text-white transition-colors text-lg">
                  <span className="mr-3">Explore</span>
                  <span className="transform group-hover:translate-x-2 transition-transform text-2xl">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    )
  }

  // Default two-card layout if no category prop
  return (
    <section className="py-20 px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-thin mb-6 text-white tracking-tight">
            Comprehensive Vehicle Intelligence
          </h2>
          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            Advanced analytics and insights across all vehicle categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Passenger Cars Card */}
          <Link to="/passenger-cars" className="group block">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <Car className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-light text-white">Passenger Cars</h3>
              </div>
              <p className="text-white/60 font-light leading-relaxed mb-6">
                Detailed analytics for passenger vehicles including market segmentation, 
                feature analysis, and competitive intelligence across global markets.
              </p>
              <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                <span className="mr-2">Explore Analytics</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Document Analysis Card */}
          <Link to="/document-analysis" className="group block">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-500/20 rounded-2xl mr-4 group-hover:bg-purple-500/30 transition-colors">
                  <Upload className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-light text-white">Document Intelligence</h3>
              </div>
              <p className="text-white/60 font-light leading-relaxed mb-6">
                Upload PDF and PowerPoint documents for AI-powered analysis. Generate intelligent 
                dashboards that correlate with your automotive data.
              </p>
              <div className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                <span className="mr-2">Upload & Analyze</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default VehicleSection
