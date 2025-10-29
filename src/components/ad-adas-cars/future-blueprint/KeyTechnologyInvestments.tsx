import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useKeyTechnologyInvestmentsData } from "@/hooks/useKeyTechnologyInvestmentsData"
import KeyTechnologyInvestmentsTable from "./KeyTechnologyInvestmentsTable"
import AnnouncementsTable from "./AnnouncementsTable"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface KeyTechnologyInvestmentsProps {
  selectedRegion: string
  selectedCategory: string
}

const KeyTechnologyInvestments = ({ selectedRegion }: KeyTechnologyInvestmentsProps) => {
  const { theme } = useTheme()
  const [selectedOEM, setSelectedOEM] = useState<string>("All")
  const [selectedInvestmentType, setSelectedInvestmentType] = useState<string>("All")
  
  const { data, isLoading } = useKeyTechnologyInvestmentsData(selectedRegion, selectedOEM, selectedInvestmentType)

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
  const investmentTypes = data?.investmentTypes || []

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm space-y-6`}>
        {/* OEM Selector */}
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

        {/* Investment Type Selector */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${theme.textSecondary}`}>Investment Type</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedInvestmentType("All")}
              variant={selectedInvestmentType === "All" ? "default" : "outline"}
              size="sm"
              className="transition-all duration-300"
            >
              All
            </Button>
            {investmentTypes.map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedInvestmentType(type)}
                variant={selectedInvestmentType === type ? "default" : "outline"}
                size="sm"
                className="transition-all duration-300"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Investments Table + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investments Table */}
        <div className="lg:col-span-2">
          <KeyTechnologyInvestmentsTable selectedOEM={selectedOEM} selectedInvestmentType={selectedInvestmentType} />
        </div>

        {/* Key Insights/Announcements */}
        <div className="lg:col-span-1">
          <AnnouncementsTable facilities={[]} />
        </div>
      </div>
    </div>
  )
}

export default KeyTechnologyInvestments
