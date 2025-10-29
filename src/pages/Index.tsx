
import { useState, useEffect } from "react"
import { Car } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import VehicleSection from "@/components/VehicleSection"
import FooterSection from "@/components/FooterSection"
import NavigationDots from "@/components/NavigationDots"
import FloatingParticles from "@/components/FloatingParticles"
import ThemeSelector from "@/components/ThemeSelector"

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
      title: "Autonomous Driving & Advanced Safety",
      subtitle: "AD/ADAS Intelligence Hub",
      description: "Comprehensive insights into autonomous driving systems, ADAS technologies, and the competitive landscape of self-driving innovation",
      image: "/lovable-uploads/c13e6208-3f44-451f-9b43-5f2707ee413c.png",
      icon: Car,
      href: "/ad-adas-cars",
      color: "from-green-600 to-emerald-400"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Theme Selector */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeSelector />
      </div>
      
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
      <NavigationDots currentSection={currentSection} totalSections={3} />
    </div>
  )
}

export default Index
