import { useTheme } from "@/contexts/ThemeContext"

interface SubTabContentProps {
  selectedSubTab: string
  selectedRegion: string
  selectedCategory: string
}

const SubTabContent = ({ selectedSubTab, selectedRegion, selectedCategory }: SubTabContentProps) => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-8 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h2 className="text-2xl font-bold mb-6">{selectedSubTab}</h2>
      <div className={`text-center ${theme.textMuted} py-12`}>
        <p className="text-lg">Content for {selectedSubTab} will be displayed here</p>
        <p className="text-sm mt-2">Region: {selectedRegion} | Category: {selectedCategory}</p>
      </div>
    </div>
  )
}

export default SubTabContent
