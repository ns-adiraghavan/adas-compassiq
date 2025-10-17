import { useTheme } from "@/contexts/ThemeContext"

interface RegionButtonsProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
}

const regions = ['US', 'Europe', 'China']

const RegionButtons = ({ selectedRegion, onRegionChange }: RegionButtonsProps) => {
  const { theme } = useTheme()

  return (
    <div>
      <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Countries/Regions</h3>
      <div className="flex gap-2">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => onRegionChange(region)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedRegion === region
                ? `${theme.primary} text-white shadow-md`
                : `${theme.cardBackground} ${theme.cardBorder} border ${theme.textSecondary} hover:${theme.primary.replace('bg-', 'bg-').replace(/\/\d+/, '/20')} hover:border-transparent`
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RegionButtons
