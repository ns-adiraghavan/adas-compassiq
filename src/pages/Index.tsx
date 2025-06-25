
import { useState, useEffect } from "react"
import { Car, Bike, Truck, Tractor } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import VehicleSection from "@/components/VehicleSection"
import FooterSection from "@/components/FooterSection"
import NavigationDots from "@/components/NavigationDots"
import FloatingParticles from "@/components/FloatingParticles"

const Index = () => {
  const [scrollY, setScrollY] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)

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

  const vehicleCategories = [
    {
      title: "Passenger Cars",
      subtitle: "Premium Automotive Intelligence",
      description: "Advanced AI-powered insights for passenger vehicle features and technologies",
      image: "/lovable-uploads/c13e6208-3f44-451f-9b43-5f2707ee413c.png",
      icon: Car,
      href: "/passenger-cars",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "Two Wheelers",
      subtitle: "Smart Mobility Solutions",
      description: "Next-generation analytics for motorcycles and electric two-wheelers",
      image: "/lovable-uploads/5bc26e8f-c225-4798-a305-557d8cc8b4af.png",
      icon: Bike,
      href: "#",
      color: "from-green-600 to-teal-600"
    },
    {
      title: "Commercial Vehicles",
      subtitle: "Fleet Intelligence Platform",
      description: "Comprehensive data analytics for trucks and commercial transportation",
      image: "/lovable-uploads/849e6ee5-f48d-44b5-b934-674f44399eeb.png",
      icon: Truck,
      href: "#",
      color: "from-orange-600 to-red-600"
    },
    {
      title: "Agriculture Vehicles",
      subtitle: "Smart Farming Technology",
      description: "Revolutionary insights for agricultural machinery and automation",
      image: "/lovable-uploads/a639b2c6-adaa-455a-adb5-c2c550261d96.png",
      icon: Tractor,
      href: "#",
      color: "from-yellow-600 to-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="section">
        <HeroSection scrollY={scrollY} />
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
