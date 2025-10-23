import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useCoreTechnologyRoadmapData } from "@/hooks/useCoreTechnologyRoadmapData"
import CoreTechnologyRoadmapTable from "./CoreTechnologyRoadmapTable"
import AnnouncementsTable from "./AnnouncementsTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface CoreTechnologyRoadmapProps {
  selectedRegion: string
  selectedCategory: string
}

const CoreTechnologyRoadmap = ({ selectedRegion }: CoreTechnologyRoadmapProps) => {
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string>("All")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  
  const { data, isLoading } = useCoreTechnologyRoadmapData(selectedRegion, selectedOEM)

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
  const categories = ["All", "Hardware", "Software", "AI Integration"]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="space-y-4">
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Core Technology Roadmap</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  variant={categoryFilter === category ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-300"
                >
                  {category}
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
          <CoreTechnologyRoadmapTable 
            selectedOEM={selectedOEM} 
            categoryFilter={categoryFilter}
          />
        </div>
        <div className="lg:col-span-1">
          <AnnouncementsTable facilities={[]} />
        </div>
      </div>
    </div>
  )
}

export default CoreTechnologyRoadmap
