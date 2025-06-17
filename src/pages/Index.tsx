import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Car, Bike, Truck, Tractor } from "lucide-react"

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
      href: "/two-wheelers",
      color: "from-green-600 to-teal-600"
    },
    {
      title: "Commercial Vehicles",
      subtitle: "Fleet Intelligence Platform",
      description: "Comprehensive data analytics for trucks and commercial transportation",
      image: "/lovable-uploads/849e6ee5-f48d-44b5-b934-674f44399eeb.png",
      icon: Truck,
      href: "/commercial-vehicles",
      color: "from-orange-600 to-red-600"
    },
    {
      title: "Agriculture Vehicles",
      subtitle: "Smart Farming Technology",
      description: "Revolutionary insights for agricultural machinery and automation",
      image: "/lovable-uploads/a639b2c6-adaa-455a-adb5-c2c550261d96.png",
      icon: Tractor,
      href: "/agriculture-vehicles",
      color: "from-yellow-600 to-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="section relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 
            className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0, 1 - scrollY / 600)
            }}
          >
            WayPoint
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            AI-Powered Automotive Intelligence Platform
          </p>
          <div 
            style={{
              transform: `translateY(${scrollY * 0.4}px)`,
              opacity: Math.max(0, 1 - scrollY / 400)
            }}
          >
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              Explore Solutions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Vehicle Categories */}
      {vehicleCategories.map((category, index) => (
        <section 
          key={category.title}
          className="section relative h-screen flex items-center justify-center"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-30`} />
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div 
              className={`space-y-6 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
              style={{
                transform: currentSection === index + 1 ? 'translateX(0)' : `translateX(${index % 2 === 0 ? '-50px' : '50px'})`,
                opacity: currentSection === index + 1 ? 1 : 0.7,
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${category.color}`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold">{category.title}</h2>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
                {category.subtitle}
              </h3>
              
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                {category.description}
              </p>
              
              <Button 
                size="lg"
                className={`bg-gradient-to-r ${category.color} hover:opacity-90 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 group`}
                onClick={() => window.location.href = category.href}
              >
                Explore {category.title}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div 
              className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
              style={{
                transform: currentSection === index + 1 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                opacity: currentSection === index + 1 ? 1 : 0.8,
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-transparent blur-xl"
                     style={{
                       borderRadius: index % 4 === 0 ? '60% 40% 30% 70% / 60% 30% 70% 40%' :
                                    index % 4 === 1 ? '40% 60% 70% 30% / 40% 70% 30% 60%' :
                                    index % 4 === 2 ? '70% 30% 40% 60% / 30% 60% 40% 70%' :
                                    '30% 70% 60% 40% / 70% 40% 60% 30%'
                     }} />
                <img
                  src={category.image}
                  alt={category.title}
                  className="relative w-full h-96 object-cover shadow-2xl"
                  style={{
                    borderRadius: index % 4 === 0 ? '60% 40% 30% 70% / 60% 30% 70% 40%' :
                                 index % 4 === 1 ? '40% 60% 70% 30% / 40% 70% 30% 60%' :
                                 index % 4 === 2 ? '70% 30% 40% 60% / 30% 60% 40% 70%' :
                                 '30% 70% 60% 40% / 70% 40% 60% 30%'
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <section className="section relative py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the future of automotive intelligence with WayPoint
          </p>
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Navigation dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((section) => (
          <button
            key={section}
            className={`block w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === section 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => {
              const sectionElement = document.querySelectorAll('.section')[section]
              sectionElement?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Index
