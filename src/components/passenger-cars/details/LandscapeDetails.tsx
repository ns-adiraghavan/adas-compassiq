
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
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Top Row - Value Boxes with auto height */}
      <div className="grid grid-cols-3 gap-4 w-full">
        <RankingValueBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BigBetCategoriesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <LighthouseFeaturesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Middle Row - Charts with auto height */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="w-full min-h-[200px]">
          <CategoryBarChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
        <div className="w-full min-h-[200px]">
          <BusinessModelPieChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
      </div>

      {/* Bottom Row - Partner Ecosystem with auto height */}
      <div className="w-full">
        <PartnerEcosystem selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>
    </div>
  )
}

export default LandscapeDetails
