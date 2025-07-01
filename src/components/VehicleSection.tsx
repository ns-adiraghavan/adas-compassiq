
import { Link } from "react-router-dom"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import AnimatedVehicleImage from "./AnimatedVehicleImage"
import VehicleContent from "./VehicleContent"
import VehicleCards from "./VehicleCards"
import FeatureModules from "./FeatureModules"

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

  if (category) {
    const isEven = index !== undefined && index % 2 === 0
    
    return (
      <section 
        ref={sectionRef}
        className="py-20 px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`flex items-center gap-12 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
            
            <AnimatedVehicleImage
              image={category.image}
              title={category.title}
              isEven={isEven}
              imageTransform={getImageTransform()}
            />
            
            <div className="flex-1">
              <VehicleContent
                icon={category.icon}
                title={category.title}
                subtitle={category.subtitle}
                description={category.description}
                textTransform={getTextTransform(isEven)}
              />
              
              <FeatureModules vehicleType={category.title} />
              
              {category.title === "Passenger Cars" && (
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
                  <Link 
                    to="/passenger-cars/landscape"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300 text-center"
                  >
                    Landscape
                  </Link>
                  <Link 
                    to="/passenger-cars/analytics"
                    className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-800 transition-all duration-300 text-center"
                  >
                    Category Analysis
                  </Link>
                  <Link 
                    to="/passenger-cars/intelligence"
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-800 transition-all duration-300 text-center"
                  >
                    Vehicle Segment Analysis
                  </Link>
                  <Link 
                    to="/passenger-cars/modeling"
                    className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-800 transition-all duration-300 text-center"
                  >
                    Business Model Analysis
                  </Link>
                  <Link 
                    to="/passenger-cars/insights"
                    className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 text-center col-span-2"
                  >
                    Insights
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return <VehicleCards />
}

export default VehicleSection
