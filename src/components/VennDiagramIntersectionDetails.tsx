
import { useState } from "react"
import { X, Search } from "lucide-react"
import { SelectedIntersection } from "@/components/VennDiagram"
import { useTheme } from "@/contexts/ThemeContext"

interface VennDiagramIntersectionDetailsProps {
  intersection: SelectedIntersection
  onClose: () => void
}

const VennDiagramIntersectionDetails = ({ intersection, onClose }: VennDiagramIntersectionDetailsProps) => {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFeatures = intersection.features.filter(feature =>
    feature.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTitle = () => {
    if (intersection.type === 'unique') {
      return `Unique to ${intersection.entities[0]}`
    } else if (intersection.type === 'pairwise') {
      return `Shared by ${intersection.entities.join(' & ')}`
    } else {
      return `Shared by All (${intersection.entities.join(', ')})`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl ${theme.shadowColor} shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className={`text-xl font-medium ${theme.textPrimary}`}>
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 ${theme.hoverEffect} rounded-lg ${theme.textMuted} hover:${theme.textPrimary.replace('text-', 'text-')}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme.textMuted}`} />
            <input
              type="text"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${theme.cardBackground} ${theme.cardBorder} border rounded-lg ${theme.textPrimary} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Feature Count */}
        <div className="px-6 py-3 border-b border-gray-700">
          <p className={`text-sm ${theme.textSecondary}`}>
            {filteredFeatures.length} of {intersection.features.length} features
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Features List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredFeatures.length > 0 ? (
            <div className="space-y-2">
              {filteredFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`p-3 ${theme.cardBackground} border ${theme.cardBorder} rounded-lg ${theme.textSecondary}`}
                >
                  {feature}
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${theme.textMuted}`}>
              {searchTerm ? 'No features match your search' : 'No features found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VennDiagramIntersectionDetails
