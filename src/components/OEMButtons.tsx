
import { Button } from "@/components/ui/button"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useMemo } from "react"

interface OEMButtonsProps {
  selectedOEM: string
  onOEMChange: (oem: string) => void
}

const OEMButtons = ({ selectedOEM, onOEMChange }: OEMButtonsProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const oems = useMemo(() => {
    if (!waypointData?.csvData?.length) return []

    const uniqueOEMs = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.OEM) {
            uniqueOEMs.add(row.OEM)
          }
        })
      }
    })

    return Array.from(uniqueOEMs).sort()
  }, [waypointData])

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="text-gray-400 mr-4 flex items-center">OEMs:</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

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
