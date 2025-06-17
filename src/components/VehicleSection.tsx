
import { Button } from "@/components/ui/button"
import { ArrowRight, LucideIcon } from "lucide-react"

interface VehicleCategory {
  title: string
  subtitle: string
  description: string
  image: string
  icon: LucideIcon
  href: string
  color: string
}

interface VehicleSectionProps {
  category: VehicleCategory
  index: number
  currentSection: number
  sectionIndex: number
}

const VehicleSection = ({ category, index, currentSection, sectionIndex }: VehicleSectionProps) => {
  return (
    <section className="section relative h-screen flex items-center justify-center">
      <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-30`} />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div 
          className={`space-y-6 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
          style={{
            transform: currentSection === sectionIndex ? 'translateX(0)' : `translateX(${index % 2 === 0 ? '-50px' : '50px'})`,
            opacity: currentSection === sectionIndex ? 1 : 0.7,
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
            transform: currentSection === sectionIndex ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
            opacity: currentSection === sectionIndex ? 1 : 0.8,
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
  )
}

export default VehicleSection
