
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
          <div 
            className="relative overflow-hidden transition-all duration-500 group-hover:scale-105"
            style={{
              borderRadius: isEven 
                ? "60% 40% 30% 70% / 60% 30% 70% 40%" 
                : "40% 60% 70% 30% / 40% 70% 30% 60%",
              transform: `rotate(${isEven ? '2deg' : '-2deg'})`,
              width: "100%",
              height: "400px"
            }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )
    }
  }

  return (
    <div 
      className="flex-1 relative"
      style={imageTransform}
    >
      {renderCarousel()}
    </div>
  )
}

export default AnimatedVehicleImage
