
import { supabase } from "@/integrations/supabase/client"

export const uploadVehicleImages = async () => {
  const images = [
    {
      name: 'passenger-car.jpg',
      url: '/lovable-uploads/c13e6208-3f44-451f-9b43-5f2707ee413c.png'
    },
    {
      name: 'two-wheeler.jpg', 
      url: '/lovable-uploads/5bc26e8f-c225-4798-a305-557d8cc8b4af.png'
    },
    {
      name: 'commercial-vehicle.jpg',
      url: '/lovable-uploads/849e6ee5-f48d-44b5-b934-674f44399eeb.png'
    },
    {
      name: 'agriculture-vehicle.jpg',
      url: '/lovable-uploads/a639b2c6-adaa-455a-adb5-c2c550261d96.png'
    }
  ]

  const uploadPromises = images.map(async (image) => {
    try {
      // Fetch the image from the current location
      const response = await fetch(image.url)
      const blob = await response.blob()
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('vehicle-images')
        .upload(image.name, blob, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error(`Error uploading ${image.name}:`, error)
        return null
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(image.name)

      return {
        name: image.name,
        url: urlData.publicUrl
      }
    } catch (error) {
      console.error(`Error processing ${image.name}:`, error)
      return null
    }
  })

  const results = await Promise.all(uploadPromises)
  return results.filter(result => result !== null)
}

export const getVehicleImageUrl = (imageName: string) => {
  const { data } = supabase.storage
    .from('vehicle-images')
    .getPublicUrl(imageName)
  
  return data.publicUrl
}
