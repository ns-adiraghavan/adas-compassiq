
import RankingValueBox from "./RankingValueBox"
import BigBetCategoriesBox from "./BigBetCategoriesBox"
import LighthouseFeaturesBox from "./LighthouseFeaturesBox"
import CategoryBarChart from "../charts/CategoryBarChart"
import BusinessModelPieChart from "../charts/BusinessModelPieChart"
import PartnerEcosystem from "./PartnerEcosystem"

interface LandscapeDetailsProps {
  selectedOEM: string
  selectedCountry: string
  onBack: () => void
}

const LandscapeDetails = ({ selectedOEM, selectedCountry }: LandscapeDetailsProps) => {
  return (
    <div className="w-full space-y-6">
      {/* Top Row - Value Boxes */}
      <div className="grid grid-cols-3 gap-6 h-32">
        <RankingValueBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BigBetCategoriesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <LighthouseFeaturesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Middle Row - Charts */}
      <div className="grid grid-cols-2 gap-6 h-80">
        <CategoryBarChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BusinessModelPieChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Bottom Row - Partner Ecosystem */}
      <div className="h-32">
        <PartnerEcosystem selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>
    </div>
  )
}

export default LandscapeDetails
