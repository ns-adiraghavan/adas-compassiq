
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
    <div className="w-full space-y-8">
      {/* Top Row - Value Boxes */}
      <div className="grid grid-cols-3 gap-8 min-h-[160px]">
        <RankingValueBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BigBetCategoriesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <LighthouseFeaturesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Middle Row - Charts */}
      <div className="grid grid-cols-2 gap-8 min-h-[400px]">
        <CategoryBarChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BusinessModelPieChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Bottom Row - Partner Ecosystem */}
      <div className="min-h-[160px]">
        <PartnerEcosystem selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>
    </div>
  )
}

export default LandscapeDetails
