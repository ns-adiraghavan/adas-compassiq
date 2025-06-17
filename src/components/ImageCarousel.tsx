
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getVehicleImageUrl } from "@/utils/uploadVehicleImages"

const vehicleImages = [
  {
    src: getVehicleImageUrl("passenger-car.jpg"),
    alt: "Futuristic luxury car with city skyline",
    title: "Premium Vehicles"
  },
  {
    src: getVehicleImageUrl("commercial-vehicle.jpg"),
    alt: "Smart autonomous truck with digital interface",
    title: "Commercial Vehicles"
  },
  {
    src: getVehicleImageUrl("two-wheeler.jpg"),
    alt: "Electric motorcycle with neon lighting",
    title: "Two Wheelers"
  },
  {
    src: getVehicleImageUrl("agriculture-vehicle.jpg"),
    alt: "High-tech agricultural tractor with solar panels",
    title: "Agricultural Vehicles"
  }
]

export function ImageCarousel() {
  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {vehicleImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative group p-8">
              <div 
                className="relative overflow-hidden transition-all duration-500 group-hover:scale-105"
                style={{
                  borderRadius: index % 2 === 0 
                    ? "60% 40% 30% 70% / 60% 30% 70% 40%" 
                    : "40% 60% 70% 30% / 40% 70% 30% 60%",
                  transform: `rotate(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                  width: "100%",
                  height: "300px"
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">{image.title}</h3>
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 drop-shadow-md">
                  Advanced automotive technologies and features
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-black/50 border-white/20 text-white hover:bg-black/70 transition-all duration-300" />
      <CarouselNext className="right-4 bg-black/50 border-white/20 text-white hover:bg-black/70 transition-all duration-300" />
    </Carousel>
  )
}
