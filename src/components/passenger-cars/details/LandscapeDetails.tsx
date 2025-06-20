
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
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Top Row - Value Boxes with fixed height */}
      <div className="grid grid-cols-3 gap-3 h-[100px] flex-shrink-0 mb-4">
        <RankingValueBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BigBetCategoriesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <LighthouseFeaturesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Middle Row - Charts with proper containment */}
      <div className="grid grid-cols-2 gap-3 h-[140px] flex-shrink-0 mb-4">
        <div className="overflow-hidden">
          <CategoryBarChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
        <div className="overflow-hidden">
          <BusinessModelPieChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
      </div>

      {/* Bottom Row - Partner Ecosystem with proper height */}
      <div className="h-[60px] flex-shrink-0">
        <PartnerEcosystem selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>
    </div>
  )
}

export default LandscapeDetails
