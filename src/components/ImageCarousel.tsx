
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const vehicleImages = [
  {
    src: "/lovable-uploads/c13e6208-3f44-451f-9b43-5f2707ee413c.png",
    alt: "Futuristic luxury car with city skyline",
    title: "Premium Vehicles"
  },
  {
    src: "/lovable-uploads/849e6ee5-f48d-44b5-b934-674f44399eeb.png",
    alt: "Smart autonomous truck with digital interface",
    title: "Commercial Vehicles"
  },
  {
    src: "/lovable-uploads/5bc26e8f-c225-4798-a305-557d8cc8b4af.png",
    alt: "Electric motorcycle with neon lighting",
    title: "Two Wheelers"
  },
  {
    src: "/lovable-uploads/a639b2c6-adaa-455a-adb5-c2c550261d96.png",
    alt: "High-tech agricultural tractor with solar panels",
    title: "Agricultural Vehicles"
  }
]

export function ImageCarousel() {
  return (
    <Card className="overflow-hidden">
      <Carousel className="w-full">
        <CarouselContent>
          {vehicleImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </Card>
  )
}
