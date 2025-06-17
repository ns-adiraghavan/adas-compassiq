
import EnhancedOverviewDashboard from "./EnhancedOverviewDashboard"

interface OverviewInsightsProps {
  selectedOEM: string
  selectedCountry: string
}

const OverviewInsights = ({ selectedOEM, selectedCountry }: OverviewInsightsProps) => {
  return <EnhancedOverviewDashboard selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
}

export default OverviewInsights
