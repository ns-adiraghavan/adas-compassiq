import { useState } from "react"
import AdAdasCarsLayout from "@/components/ad-adas-cars/AdAdasCarsLayout"
import { useCountryContext } from "@/contexts/CountryContext"

const Ecosystem = () => {
  const { selectedCountry, setSelectedCountry } = useCountryContext()
  const [selectedCategory, setSelectedCategory] = useState("oem")

  return (
    <AdAdasCarsLayout>
      <AdAdasCarsLayout.Content
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </AdAdasCarsLayout>
  )
}

export default Ecosystem
