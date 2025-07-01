
import { CSSProperties } from "react"
import PassengerCarsCarousel from "./PassengerCarsCarousel"
import TwoWheelersCarousel from "./TwoWheelersCarousel"
import CommercialVehiclesCarousel from "./CommercialVehiclesCarousel"
import AgricultureVehiclesCarousel from "./AgricultureVehiclesCarousel"

interface AnimatedVehicleImageProps {
  image: string
  title: string
  isEven: boolean
  imageTransform: CSSProperties
}

const AnimatedVehicleImage = ({ image, title, isEven, imageTransform }: AnimatedVehicleImageProps) => {
  const renderCarousel = () => {
    switch (title) {
      case "Passenger Cars":
        return <PassengerCarsCarousel />
      case "Two Wheelers":
        return <TwoWheelersCarousel />
      case "Commercial Vehicles":
        return <CommercialVehiclesCarousel />
      case "Agriculture Vehicles":
        return <AgricultureVehiclesCarousel />
      default:
        return (
          <div className="w-full h-[400px] rounded-2xl overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )
    }
  }

  return (
    <div 
      className="w-full max-w-lg mx-auto relative group"
      style={imageTransform}
    >
      {/* Background decorative elements */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
      
      {/* Main carousel container */}
      <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-[1.02]">
        {renderCarousel()}
      </div>
      
      {/* Category label */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
          {title}
        </div>
      </div>
    </div>
  )
}

export default AnimatedVehicleImage
