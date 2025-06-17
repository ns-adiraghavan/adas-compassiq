
import { KPICard } from "@/components/KPICard"
import { Car, Globe, Layers, DollarSign } from "lucide-react"
import { useMemo } from "react"

interface MetricsGridProps {
  selectedOEM: string
  selectedCountry: string
  filteredData: any[]
}

const MetricsGrid = ({ selectedOEM, selectedCountry, filteredData }: MetricsGridProps) => {
  const metrics = useMemo(() => {
    if (!filteredData.length) {
      return {
        totalFeatures: 0,
        countries: 0,
        categories: 0,
        businessModels: 0
      }
    }

    const uniqueCountries = new Set<string>()
    const uniqueCategories = new Set<string>()
    const uniqueBusinessModels = new Set<string>()
    
    filteredData.forEach(row => {
      if (row.Country) uniqueCountries.add(row.Country)
      if (row.Category) uniqueCategories.add(row.Category)
      if (row["Business Model Type"]) uniqueBusinessModels.add(row["Business Model Type"])
    })

    return {
      totalFeatures: filteredData.length,
      countries: uniqueCountries.size,
      categories: uniqueCategories.size,
      businessModels: uniqueBusinessModels.size
    }
  }, [filteredData])

  return (
    <div className="space-y-4">
      <KPICard
        title="Total Features"
        value={metrics.totalFeatures}
        subtitle={selectedCountry === "Global" ? "Across all markets" : `In ${selectedCountry}`}
        icon={<Car className="h-4 w-4" />}
      />
      
      <KPICard
        title="Market Presence"
        value={metrics.countries}
        subtitle={metrics.countries === 1 ? "Country" : "Countries"}
        icon={<Globe className="h-4 w-4" />}
      />
      
      <KPICard
        title="Feature Categories"
        value={metrics.categories}
        subtitle="Service categories"
        icon={<Layers className="h-4 w-4" />}
      />
      
      <KPICard
        title="Business Models"
        value={metrics.businessModels}
        subtitle="Revenue strategies"
        icon={<DollarSign className="h-4 w-4" />}
      />
    </div>
  )
}

export default MetricsGrid
