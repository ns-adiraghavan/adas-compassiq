import { useTheme } from "@/contexts/ThemeContext"

interface PlayerCategoryButtonsProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: 'oem', label: 'OEM' },
  { id: 'ad-tech-stack', label: 'AD Tech Stack' },
  { id: 'mobility-services', label: 'Mobility Services' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'software', label: 'Software' },
  { id: 'sensing', label: 'Sensing' },
]

const PlayerCategoryButtons = ({ selectedCategory, onCategoryChange }: PlayerCategoryButtonsProps) => {
  const { theme } = useTheme()

  return (
    <div>
      <h3 className={`text-sm font-medium ${theme.textMuted} mb-3`}>Player Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? `${theme.primary} text-white shadow-md`
                : `${theme.cardBackground} ${theme.cardBorder} border ${theme.textSecondary} hover:${theme.primary.replace('bg-', 'bg-').replace(/\/\d+/, '/20')} hover:border-transparent`
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlayerCategoryButtons
