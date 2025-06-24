
import { useState } from "react"
import { VennDiagramData, EntityFeatureData } from "@/utils/vennDiagramUtils"
import { SelectedIntersection } from "@/components/VennDiagram"
import { useTheme } from "@/contexts/ThemeContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, ChevronDown } from "lucide-react"

interface VennDiagramTableProps {
  data: VennDiagramData
  entities: EntityFeatureData[]
  selectedIntersection: SelectedIntersection | null
}

interface CategoryData {
  name: string
  counts: Record<string, number>
  features: Record<string, string[]>
  total: number
}

const VennDiagramTable = ({ data, entities, selectedIntersection }: VennDiagramTableProps) => {
  const { theme } = useTheme()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // If no intersection is selected, show a message
  if (!selectedIntersection) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <h3 className={`text-xl font-medium ${theme.textPrimary} mb-4`}>
          Feature Distribution (Set Notation)
        </h3>
        <div className={`flex items-center justify-center py-8 ${theme.textMuted}`}>
          <p>Click on a section of the Venn diagram to view feature details</p>
        </div>
      </div>
    )
  }

  // Process features to group by categories (mock categories for demo)
  const processFeaturesByCategories = (): CategoryData[] => {
    const categories = ['Mobility', 'Health', 'Work', 'Energy', 'Shopping', 'Enabler', 'Entertainment']
    const categoryData: CategoryData[] = []

    categories.forEach(category => {
      // Filter features that might belong to this category (simplified logic)
      const categoryFeatures = selectedIntersection.features.filter(feature => 
        feature.toLowerCase().includes(category.toLowerCase()) ||
        (category === 'Mobility' && (feature.toLowerCase().includes('drive') || feature.toLowerCase().includes('travel'))) ||
        (category === 'Health' && (feature.toLowerCase().includes('health') || feature.toLowerCase().includes('medical'))) ||
        (category === 'Work' && (feature.toLowerCase().includes('work') || feature.toLowerCase().includes('office'))) ||
        (category === 'Energy' && (feature.toLowerCase().includes('energy') || feature.toLowerCase().includes('fuel'))) ||
        (category === 'Shopping' && (feature.toLowerCase().includes('shop') || feature.toLowerCase().includes('purchase'))) ||
        (category === 'Enabler' && (feature.toLowerCase().includes('connect') || feature.toLowerCase().includes('enable'))) ||
        (category === 'Entertainment' && (feature.toLowerCase().includes('music') || feature.toLowerCase().includes('media')))
      )

      if (categoryFeatures.length > 0) {
        const counts: Record<string, number> = {}
        const featuresPerEntity: Record<string, string[]> = {}
        
        selectedIntersection.entities.forEach(entity => {
          counts[entity] = Math.floor(Math.random() * categoryFeatures.length) + 1 // Mock data
          featuresPerEntity[entity] = categoryFeatures.slice(0, counts[entity])
        })

        categoryData.push({
          name: category,
          counts,
          features: featuresPerEntity,
          total: categoryFeatures.length
        })
      }
    })

    // If no categorized features, create a general category
    if (categoryData.length === 0) {
      const counts: Record<string, number> = {}
      const featuresPerEntity: Record<string, string[]> = {}
      
      selectedIntersection.entities.forEach(entity => {
        counts[entity] = selectedIntersection.features.length
        featuresPerEntity[entity] = selectedIntersection.features
      })

      categoryData.push({
        name: 'General',
        counts,
        features: featuresPerEntity,
        total: selectedIntersection.features.length
      })
    }

    return categoryData.sort((a, b) => b.total - a.total)
  }

  const categoryData = processFeaturesByCategories()

  const getCellColor = (value: number, maxInRow: number) => {
    if (value === 0) return 'transparent'
    const intensity = value / maxInRow
    if (intensity > 0.7) return 'rgba(59, 130, 246, 0.8)'
    if (intensity > 0.4) return 'rgba(59, 130, 246, 0.5)'
    return 'rgba(59, 130, 246, 0.3)'
  }

  const handleCategoryClick = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName)
  }

  const getIntersectionLabel = () => {
    if (selectedIntersection.type === 'unique') {
      return `Features unique to ${selectedIntersection.entities[0]}`
    } else if (selectedIntersection.type === 'pairwise') {
      return `Features shared between ${selectedIntersection.entities.join(' and ')}`
    } else if (selectedIntersection.type === 'threeway') {
      return `Features shared by all three OEMs`
    }
    return 'Selected Features'
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-xl font-medium ${theme.textPrimary} mb-4`}>
        Feature Distribution (Set Notation)
      </h3>
      
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-lg p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h4 className={`text-lg font-medium ${theme.textPrimary}`}>
            {getIntersectionLabel()}
          </h4>
          <span className={`text-sm font-semibold ${theme.textPrimary} bg-blue-500/20 px-3 py-1 rounded-full`}>
            {selectedIntersection.features.length} features
          </span>
        </div>
        
        {categoryData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={`${theme.cardBorder} border-b`}>
                  <TableHead className={`text-left ${theme.textPrimary} font-medium`}>
                    Category
                  </TableHead>
                  {selectedIntersection.entities.map(entity => (
                    <TableHead key={entity} className={`text-center ${theme.textPrimary} font-medium min-w-[100px]`}>
                      {entity}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((category) => {
                  const maxInRow = Math.max(...selectedIntersection.entities.map(entity => category.counts[entity] || 0))
                  const isExpanded = expandedCategory === category.name
                  
                  return (
                    <>
                      <TableRow 
                        key={category.name}
                        className={`${theme.cardBorder} border-b hover:${theme.cardBackground} cursor-pointer transition-colors`}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <TableCell className={`${theme.textSecondary} font-medium`}>
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            {category.name}
                          </div>
                        </TableCell>
                        {selectedIntersection.entities.map(entity => {
                          const value = category.counts[entity] || 0
                          return (
                            <TableCell 
                              key={entity}
                              className="text-center font-semibold"
                              style={{ 
                                backgroundColor: getCellColor(value, maxInRow),
                                color: value > 0 ? 'white' : 'rgba(255,255,255,0.4)'
                              }}
                            >
                              {value > 0 ? value : '-'}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={selectedIntersection.entities.length + 1} className="p-0">
                            <div className={`${theme.cardBackground} border-t ${theme.cardBorder} p-4`}>
                              <h5 className={`text-sm font-medium ${theme.textPrimary} mb-3`}>
                                Features in {category.name}:
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {selectedIntersection.features
                                  .filter(feature => 
                                    feature.toLowerCase().includes(category.name.toLowerCase()) ||
                                    category.name === 'General'
                                  )
                                  .map((feature, index) => (
                                    <div
                                      key={index}
                                      className={`text-sm ${theme.textSecondary} bg-gray-500/10 px-3 py-2 rounded border`}
                                    >
                                      {feature}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className={`${theme.textMuted} text-center py-8`}>
            <p>No features found for this intersection</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VennDiagramTable
