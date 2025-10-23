import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useGlobalFootprintData } from "@/hooks/useGlobalFootprintData"
import USMap from "./USMap"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface GlobalFootprintProps {
  selectedRegion: string
  selectedCategory: string
}

const GlobalFootprint = ({ selectedRegion }: GlobalFootprintProps) => {
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string>("All")
  const [facilityType, setFacilityType] = useState<string>("All")
  
  const { data, isLoading } = useGlobalFootprintData(selectedRegion, selectedOEM, facilityType)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
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
  const facilityTypes = ["All", "R&D Center", "Testing"]

  return (
    <div className="space-y-6">
      {/* Facility Type Buttons */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="space-y-4">
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Facility Type</h3>
            <div className="flex flex-wrap gap-2">
              {facilityTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => setFacilityType(type)}
                  variant={facilityType === type ? "default" : "outline"}
                  size="sm"
                  className="transition-all duration-300"
                >
                  {type}
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

      {/* Map and Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <USMap facilities={data?.facilities || []} />
        </div>

        <div className="lg:col-span-1">
          <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm h-full`}>
            <h3 className={`text-lg font-bold mb-4 ${theme.textPrimary}`}>Key Insights/Announcements</h3>
            
            <div className="space-y-4">
              {data?.facilities && data.facilities.length > 0 ? (
                data.facilities.slice(0, 5).map((facility, idx) => (
                  <div key={idx} className={`p-4 rounded-lg ${theme.cardBackground} border ${theme.cardBorder}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        facility.facilityType === "R&D Center" 
                          ? "bg-chart-1" 
                          : facility.facilityType === "Testing"
                          ? "bg-chart-2"
                          : "bg-primary"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold ${theme.textPrimary}`}>{facility.oem}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${theme.cardBorder} border ${theme.textMuted}`}>
                            {facility.facilityType}
                          </span>
                        </div>
                        <p className={`text-sm ${theme.textSecondary} mb-1`}>
                          <span className="font-medium">Location:</span> {facility.location}
                        </p>
                        <p className={`text-xs ${theme.textMuted}`}>
                          {facility.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm ${theme.textMuted} text-center py-8`}>
                  No facilities found for the selected filters
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalFootprint
