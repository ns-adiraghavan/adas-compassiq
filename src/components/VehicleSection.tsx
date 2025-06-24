
import { Link } from "react-router-dom"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import AnimatedVehicleImage from "./AnimatedVehicleImage"
import VehicleContent from "./VehicleContent"
import VehicleCards from "./VehicleCards"

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
  const { sectionRef, getImageTransform, getTextTransform } = useScrollAnimation()

  // If category prop is provided, render single category
  if (category) {
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
              <AnimatedVehicleImage
                image={category.image}
                title={category.title}
                isEven={isEven}
                imageTransform={getImageTransform()}
              />
              
              {/* Content with side sliding animation */}
              <VehicleContent
                icon={category.icon}
                title={category.title}
                subtitle={category.subtitle}
                description={category.description}
                textTransform={getTextTransform(isEven)}
              />
            </div>
          </Link>
        </div>
      </section>
    )
  }

  // Default two-card layout if no category prop
  return <VehicleCards />
}

export default VehicleSection
