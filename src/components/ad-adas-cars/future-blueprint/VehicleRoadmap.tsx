import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useVehicleRoadmapData } from "@/hooks/useVehicleRoadmapData"
import VehicleRoadmapTable from "./VehicleRoadmapTable"
import AnnouncementsTable from "./AnnouncementsTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface VehicleRoadmapProps {
  selectedRegion: string
  selectedCategory: string
}

const VehicleRoadmap = ({ selectedRegion }: VehicleRoadmapProps) => {
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string>("All")
  const [parameterFilter, setParameterFilter] = useState<string>("All")
  
  const { data, isLoading } = useVehicleRoadmapData(selectedRegion, selectedOEM)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const oems = data?.oems || []
  const parameters = ["All", "Vehicle Models", "Vehicle Platforms", "New Features"]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="space-y-4">
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Parameters</h3>
            <div className="flex flex-wrap gap-2">
              {parameters.map((param) => (
                <Button
                  key={param}
                  onClick={() => setParameterFilter(param)}
                  variant={parameterFilter === param ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-300"
                >
                  {param}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Player Selector</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedOEM("All")}
                variant={selectedOEM === "All" ? "default" : "outline"}
                size="sm"
                className="transition-all duration-300"
              >
                All
              </Button>
              {oems.map((oem) => (
                <Button
                  key={oem}
                  onClick={() => setSelectedOEM(oem)}
                  variant={selectedOEM === oem ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-300"
                >
                  {oem}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VehicleRoadmapTable 
            selectedOEM={selectedOEM} 
            parameterFilter={parameterFilter}
          />
        </div>
        <div className="lg:col-span-1">
          <AnnouncementsTable facilities={[]} />
        </div>
      </div>
    </div>
  )
}

export default VehicleRoadmap
