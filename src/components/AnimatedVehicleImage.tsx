
import { CSSProperties } from "react"

interface AnimatedVehicleImageProps {
  image: string
  title: string
  isEven: boolean
  imageTransform: CSSProperties
}

const AnimatedVehicleImage = ({ image, title, isEven, imageTransform }: AnimatedVehicleImageProps) => {
  return (
    <div 
      className="relative overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-700 ease-out"
      style={{
        borderRadius: isEven 
          ? "65% 35% 25% 75% / 55% 25% 75% 45%" 
          : "35% 65% 75% 25% / 45% 75% 25% 55%",
        transform: `rotate(${isEven ? '3deg' : '-3deg'})`,
        width: "450px",
        height: "350px",
        ...imageTransform
      }}
    >
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}

export default AnimatedVehicleImage
