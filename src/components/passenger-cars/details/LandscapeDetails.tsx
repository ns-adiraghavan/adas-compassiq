
import { ArrowLeft } from "lucide-react"
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

const LandscapeDetails = ({ selectedOEM, selectedCountry, onBack }: LandscapeDetailsProps) => {
  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-white/60 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Landscape
          </button>
          <h2 className="text-2xl font-medium text-white">
            {selectedOEM} - Detailed Analysis
          </h2>
        </div>
        {selectedCountry && (
          <div className="text-sm text-gray-400">
            Country: {selectedCountry}
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100%-80px)]">
        {/* Top Row - Value Boxes */}
        <div className="col-span-4">
          <RankingValueBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
        <div className="col-span-4">
          <BigBetCategoriesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
        <div className="col-span-4">
          <LighthouseFeaturesBox selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>

        {/* Middle Row - Charts */}
        <div className="col-span-8">
          <CategoryBarChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
        <div className="col-span-4">
          <BusinessModelPieChart selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>

        {/* Bottom Row - Partner Ecosystem */}
        <div className="col-span-12">
          <PartnerEcosystem selectedOEM={selectedOEM} selectedCountry={selectedCountry} />
        </div>
      </div>
    </div>
  )
}

export default LandscapeDetails
