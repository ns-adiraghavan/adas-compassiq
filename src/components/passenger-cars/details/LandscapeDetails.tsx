
import RankingValueBox from "./RankingValueBox"
import BigBetCategoriesBox from "./BigBetCategoriesBox"
import LighthouseFeaturesBox from "./LighthouseFeaturesBox"
import CategoryBarChart from "../charts/CategoryBarChart"
import BusinessModelPieChart from "../charts/BusinessModelPieChart"
import PartnerEcosystem from "./PartnerEcosystem"
import { useOEMLogo } from "@/hooks/useOEMLogo"

interface LandscapeDetailsProps {
  selectedOEM: string
  selectedCountry: string
  onBack: () => void
}

const LandscapeDetails = ({ selectedOEM, selectedCountry }: LandscapeDetailsProps) => {
  const { data: logoUrl, isLoading: logoLoading } = useOEMLogo(selectedOEM)

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* OEM Logo and Title Section */}
      <div className="flex items-center space-x-4 mb-2">
        {logoLoading ? (
          <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-lg"></div>
        ) : logoUrl ? (
          <img 
            src={logoUrl} 
            alt={`${selectedOEM} logo`}
            className="w-12 h-12 object-contain rounded-lg bg-white/10 p-2"
            onError={(e) => {
              console.log('Failed to load logo:', logoUrl)
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {selectedOEM.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <h3 className="text-xl font-medium text-white">
          {selectedOEM} - Detailed Analysis
        </h3>
      </div>

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
