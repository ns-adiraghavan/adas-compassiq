import { useTheme } from "@/contexts/ThemeContext"

interface SubTabButtonsProps {
  tabs: string[]
  selectedTab: string
  onTabChange: (tab: string) => void
}

const SubTabButtons = ({ tabs, selectedTab, onTabChange }: SubTabButtonsProps) => {
  const { theme } = useTheme()

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            selectedTab === tab
              ? `${theme.primary} text-white shadow-md`
              : `${theme.cardBackground} ${theme.cardBorder} border ${theme.textSecondary} hover:${theme.primary.replace('bg-', 'bg-').replace(/\/\d+/, '/20')} hover:border-transparent`
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default SubTabButtons
