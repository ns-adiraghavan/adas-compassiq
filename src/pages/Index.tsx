
import { useState, useEffect } from "react"
import { Car, Bike, Truck, Tractor, Upload } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import VehicleSection from "@/components/VehicleSection"
import FooterSection from "@/components/FooterSection"
import NavigationDots from "@/components/NavigationDots"
import FloatingParticles from "@/components/FloatingParticles"
import Dashboard from "@/components/Dashboard"
import FileUpload from "@/components/FileUpload"
import { getVehicleImageUrl, uploadVehicleImages } from "@/utils/uploadVehicleImages"

const Index = () => {
  const [scrollY, setScrollY] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [imagesUploaded, setImagesUploaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      // Determine current section based on scroll position
      const sections = document.querySelectorAll('.section')
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setCurrentSection(index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Upload images to Supabase on component mount
    const uploadImages = async () => {
      try {
        await uploadVehicleImages()
        setImagesUploaded(true)
        console.log('Vehicle images uploaded to Supabase successfully')
      } catch (error) {
        console.error('Error uploading vehicle images:', error)
      }
    }

    uploadImages()
  }, [])

  const vehicleCategories = [
    {
      title: "Passenger Cars",
      subtitle: "Premium Automotive Intelligence",
      description: "Advanced AI-powered insights for passenger vehicle features and technologies",
      image: getVehicleImageUrl("passenger-car.jpg"),
      icon: Car,
      href: "/passenger-cars",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "Two Wheelers",
      subtitle: "Smart Mobility Solutions",
      description: "Next-generation analytics for motorcycles and electric two-wheelers",
      image: getVehicleImageUrl("two-wheeler.jpg"),
      icon: Bike,
      href: "/two-wheelers",
      color: "from-green-600 to-teal-600"
    },
    {
      title: "Commercial Vehicles",
      subtitle: "Fleet Intelligence Platform",
      description: "Comprehensive data analytics for trucks and commercial transportation",
      image: getVehicleImageUrl("commercial-vehicle.jpg"),
      icon: Truck,
      href: "/commercial-vehicles",
      color: "from-orange-600 to-red-600"
    },
    {
      title: "Agriculture Vehicles",
      subtitle: "Smart Farming Technology",
      description: "Revolutionary insights for agricultural machinery and automation",
      image: getVehicleImageUrl("agriculture-vehicle.jpg"),
      icon: Tractor,
      href: "/agriculture-vehicles",
      color: "from-yellow-600 to-orange-600"
    }
  ]

  const handleFileAnalyzed = (analysis: any) => {
    setAnalysisData(analysis)
    console.log('File analysis completed:', analysis)
  }

  // Toggle upload view
  if (showUpload) {
    return <FileUpload onFileAnalyzed={handleFileAnalyzed} />
  }

  // Toggle dashboard view
  if (showDashboard) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Upload and Dashboard Toggle */}
      <div className="section">
        <HeroSection scrollY={scrollY} />
        <div className="absolute top-6 right-6 z-50 flex gap-4">
          <button
            onClick={() => setShowUpload(true)}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 font-light flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Documents
          </button>
          <button
            onClick={() => setShowDashboard(true)}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white hover:bg-white/20 transition-all duration-300 font-light"
          >
            View Live Data
          </button>
        </div>
      </div>
      <FloatingParticles scrollY={scrollY} />

      {/* Vehicle Categories */}
      {vehicleCategories.map((category, index) => (
        <div key={category.title} className="section">
          <VehicleSection
            category={category}
            index={index}
            currentSection={currentSection}
            sectionIndex={index + 1}
          />
        </div>
      ))}

      {/* Footer */}
      <div className="section">
        <FooterSection />
      </div>

      {/* Navigation dots */}
      <NavigationDots currentSection={currentSection} totalSections={6} />
    </div>
  )
}

export default Index
