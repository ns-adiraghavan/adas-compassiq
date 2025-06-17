
import { Button } from "@/components/ui/button"

interface OEMButtonsProps {
  selectedOEM: string
  onOEMChange: (oem: string) => void
}

const OEMButtons = ({ selectedOEM, onOEMChange }: OEMButtonsProps) => {
  const oems = [
    "All", "Toyota", "Volkswagen", "Ford", "Honda", "Nissan", 
    "Hyundai", "BMW", "Mercedes", "Audi", "Tesla", "General Motors"
  ]

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-gray-400 mr-4 flex items-center">OEMs:</span>
      {oems.map((oem) => (
        <Button
          key={oem}
          variant={selectedOEM === oem ? "default" : "outline"}
          size="sm"
          onClick={() => onOEMChange(oem)}
          className={`${
            selectedOEM === oem 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }`}
        >
          {oem}
        </Button>
      ))}
    </div>
  )
}

export default OEMButtons
