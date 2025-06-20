
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
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Top Row - Value Boxes - Fixed height */}
      <div className="grid grid-cols-3 gap-4 flex-shrink-0" style={{ height: '100px' }}>
        <RankingValueBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BigBetCategoriesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <LighthouseFeaturesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Middle Row - Charts - Flexible height */}
      <div className="grid grid-cols-2 gap-4 flex-1" style={{ minHeight: '120px' }}>
        <CategoryBarChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        <BusinessModelPieChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>

      {/* Bottom Row - Partner Ecosystem - Fixed height */}
      <div className="flex-shrink-0" style={{ height: '80px' }}>
        <PartnerEcosystem selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
      </div>
    </div>
  )
}

export default LandscapeDetails
