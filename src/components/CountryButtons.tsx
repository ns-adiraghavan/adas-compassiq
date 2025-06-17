
import { Button } from "@/components/ui/button"

interface CountryButtonsProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

const CountryButtons = ({ selectedCountry, onCountryChange }: CountryButtonsProps) => {
  const countries = [
    "Global", "United States", "China", "Germany", "Japan", 
    "United Kingdom", "France", "Italy", "South Korea", 
    "India", "Canada", "Australia", "Brazil", "Mexico"
  ]

  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 font-medium mb-4">Countries/Regions</h3>
      {countries.map((country) => (
        <Button
          key={country}
          variant={selectedCountry === country ? "default" : "ghost"}
          size="sm"
          onClick={() => onCountryChange(country)}
          className={`w-full justify-start ${
            selectedCountry === country 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          {country}
        </Button>
      ))}
    </div>
  )
}

export default CountryButtons
