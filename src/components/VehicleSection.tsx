
import { Link } from "react-router-dom"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import AnimatedVehicleImage from "./AnimatedVehicleImage"
import VehicleContent from "./VehicleContent"
import VehicleCards from "./VehicleCards"
import FeatureModules from "./FeatureModules"
import ADASModuleBoxes from "./ADASModuleBoxes"

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
        className="py-20 px-8 bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/10 to-black"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 gap-12 items-center">
            
            {/* Text Content - Full Width */}
            <div className="flex flex-col justify-center">
              <VehicleContent
                icon={category.icon}
                title={category.title}
                subtitle={category.subtitle}
                description={category.description}
                textTransform={getTextTransform(isEven)}
                href={category.href}
              />
              
              <FeatureModules vehicleType={category.title} />
              
              {/* Show module boxes only for AD/ADAS */}
              {category.title === "Autonomous Driving & Advanced Safety" && (
                <ADASModuleBoxes />
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
