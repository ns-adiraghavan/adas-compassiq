
import { Card } from "@/components/ui/card"
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
    <Card className="overflow-hidden hover-glow animate-fade-in bg-gradient-to-br from-card/50 to-card border-primary/20">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {vehicleImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl mb-2">{image.title}</h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
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
    </Card>
  )
}
