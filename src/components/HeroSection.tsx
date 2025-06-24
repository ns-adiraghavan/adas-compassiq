
import { ArrowRight } from "lucide-react"
import WaypointLogo from "./WaypointLogo"
import { useState, useEffect } from "react"

interface HeroSectionProps {
  scrollY: number
}

const HeroSection = ({ scrollY }: HeroSectionProps) => {
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 500)
    const timer2 = setTimeout(() => setSubtitleVisible(true), 1500)
    const timer3 = setTimeout(() => setDescriptionVisible(true), 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <section className="section relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Logo in top-left corner */}
      <div 
        className="absolute top-6 left-6 z-20"
        style={{
          opacity: Math.max(0, 1 - scrollY / 400)
        }}
      >
        <WaypointLogo />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 
          className={`text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent transition-all duration-1000 ${
            titleVisible ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: Math.max(0, 1 - scrollY / 600),
            animation: titleVisible ? 'typewriter 2s steps(8, end), blink-caret 0.75s step-end infinite' : 'none'
          }}
        >
          WayPoint
        </h1>
        
        <p 
          className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
            subtitleVisible ? 'animate-slide-in-right opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 500)
          }}
        >
          AI-Powered Automotive Intelligence Platform
        </p>
        
        <div 
          className={`text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-2000 ${
            descriptionVisible ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
            opacity: Math.max(0, 1 - scrollY / 400)
          }}
        >
          <p className="animate-pulse-slow">
            WayPoint is a specialized data and insights platform designed specifically for the mobility industry. 
            Curated by a team of passionate automotive analysts, it reflects a deep understanding of the pulse 
            and dynamics of the automotive sector. The platform is structured around four core solution areas, 
            each tailored to a distinct vehicle class, ensuring targeted, relevant insights for strategic thinking.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes typewriter {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: white }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
